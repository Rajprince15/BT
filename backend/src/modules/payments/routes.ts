/**
 * Razorpay webhook receiver.
 * Mounted BEFORE express.json in app.ts so `req.body` is the raw Buffer
 * used for signature verification.
 */
import { Router } from 'express';
import { exec, query } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { env } from '../../config/env';
import { paymentLogger } from '../../config/logger';
import { hmacSha256, timingSafeEqual } from '../../utils/tokens';
import { BadRequestError } from '../../utils/errors';
import { sendMail } from '../../config/mailer';

const router = Router();

router.post('/razorpay', asyncWrap(async (req, res): Promise<void> => {
  const rawBody = (req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body));
  const signature = req.header('x-razorpay-signature') ?? '';
  const expected = hmacSha256(env.RAZORPAY_WEBHOOK_SECRET, rawBody);
  if (!timingSafeEqual(expected, signature)) {
    paymentLogger.warn('rp.webhook.signature_mismatch');
    throw new BadRequestError('Signature mismatch', {}, 'WEBHOOK_INVALID');
  }

  const event = JSON.parse(rawBody) as { event: string; payload: Record<string, unknown> };
  paymentLogger.info('rp.webhook.received', { event: event.event });

  const eventId = req.header('x-razorpay-event-id') ?? `${event.event}-${Date.now()}`;
  // Idempotency: reject duplicate events
  const seen = await query<{ id: number }>(`SELECT id FROM audit_logs WHERE action = :a AND entity_id = :e LIMIT 1`, {
    a: `rp.webhook.${event.event}`, e: eventId,
  });
  if (seen[0]) {
    res.json(ok({ replayed: true }));
    return;
  }

  await exec(
    `INSERT INTO audit_logs (action, entity, entity_id, after_json) VALUES (:a, 'razorpay_webhook', :e, :p)`,
    { a: `rp.webhook.${event.event}`, e: eventId, p: rawBody },
  );

  switch (event.event) {
    case 'payment.captured': {
      const paymentEntity = ((event.payload.payment as Record<string, unknown>).entity ?? event.payload.payment) as { id: string; order_id: string };
      await exec(
        `UPDATE payments SET status = 'captured', updated_at = CURRENT_TIMESTAMP
         WHERE razorpay_order_id = :orderId AND razorpay_payment_id = :pid`,
        { orderId: paymentEntity.order_id, pid: paymentEntity.id },
      );
      break;
    }
    case 'payment.failed': {
      const paymentEntity = ((event.payload.payment as Record<string, unknown>).entity ?? event.payload.payment) as { id: string; order_id: string };
      await exec(`UPDATE payments SET status = 'failed', updated_at = CURRENT_TIMESTAMP
                  WHERE razorpay_order_id = :orderId`, { orderId: paymentEntity.order_id });
      break;
    }
    case 'refund.processed': {
      const refundEntity = ((event.payload.refund as Record<string, unknown>).entity ?? event.payload.refund) as { id: string; payment_id: string; amount: number };
      const rows = await query<{ order_id: number; user_email?: string; user_name?: string; order_number?: string }>(
        `SELECT p.order_id, u.email AS user_email, u.name AS user_name, o.order_number
         FROM payments p LEFT JOIN orders o ON o.id = p.order_id LEFT JOIN users u ON u.id = o.user_id
         WHERE p.razorpay_payment_id = :pid LIMIT 1`,
        { pid: refundEntity.payment_id },
      );
      await exec(`UPDATE payments SET status = 'refunded', updated_at = CURRENT_TIMESTAMP
                  WHERE razorpay_payment_id = :pid`, { pid: refundEntity.payment_id });
      if (rows[0]?.user_email) {
        await sendMail({
          to: rows[0].user_email,
          subject: `Refund processed for order ${rows[0].order_number}`,
          template: 'refund-processed',
          data: { name: rows[0].user_name, orderNumber: rows[0].order_number, amount: (refundEntity.amount / 100).toLocaleString('en-IN'), year: new Date().getFullYear() },
        }).catch(() => undefined);
      }
      break;
    }
    default:
      paymentLogger.info('rp.webhook.unhandled', { event: event.event });
  }
  res.json(ok({ handled: true }));
}));

export default router;
