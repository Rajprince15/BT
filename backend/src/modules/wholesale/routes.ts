import { Router } from 'express';
import { z } from 'zod';
import { exec } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { publicFormLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { sendMail } from '../../config/mailer';
import { sanitizeHtml } from '../../utils/sanitize';

const router = Router();

const wholesaleSchema = z.object({
  companyName: z.string().trim().min(2).max(200),
  contactPerson: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(6).max(20),
  businessType: z.string().trim().min(2).max(120),
  productInterest: z.string().trim().max(200).optional(),
  quantityRequirement: z.string().trim().max(80).optional(),
  message: z.string().trim().max(4000).optional(),
  website: z.string().max(200).optional(), // honeypot — must be empty
});

router.post('/', publicFormLimiter, validate({ body: wholesaleSchema }), asyncWrap(async (req, res): Promise<void> => {
  const body = req.body as z.infer<typeof wholesaleSchema>;
  if (body.website) {
    res.json(ok({ received: true })); // honeypot: silently succeed
    return;
  }

  await exec(
    `INSERT INTO wholesale_inquiries
     (company_name, contact_person, email, phone, business_type, product_interest, quantity_requirement, message)
     VALUES (:companyName, :contactPerson, :email, :phone, :businessType, :productInterest, :quantityRequirement, :message)`,
    {
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      businessType: body.businessType,
      productInterest: body.productInterest ?? null,
      quantityRequirement: body.quantityRequirement ?? null,
      message: body.message ? sanitizeHtml(body.message) : null,
    },
  );

  await sendMail({
    to: body.email,
    subject: 'Thank you for your inquiry',
    template: 'wholesale-inquiry-ack',
    data: { contactPerson: body.contactPerson, companyName: body.companyName, year: new Date().getFullYear() },
  }).catch(() => undefined);

  res.status(201).json(ok({ received: true }));
}));

export default router;
