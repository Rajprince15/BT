import fs from 'fs';
import path from 'path';
import nodemailer, { Transporter } from 'nodemailer';
import Handlebars from 'handlebars';
import { env, isProd } from '../config/env';
import { logger } from '../config/logger';

const TEMPLATE_DIR = path.resolve(__dirname, '..', 'templates', 'emails');
const templateCache = new Map<string, HandlebarsTemplateDelegate>();

function loadTemplate(name: string): HandlebarsTemplateDelegate {
  const cached = templateCache.get(name);
  if (cached) return cached;
  const file = path.join(TEMPLATE_DIR, `${name}.hbs`);
  const source = fs.readFileSync(file, 'utf8');
  const compiled = Handlebars.compile(source, { noEscape: false });
  templateCache.set(name, compiled);
  return compiled;
}

function createTransport(): Transporter {
  if (env.EMAIL_PROVIDER === 'sendgrid' && env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: { user: 'apikey', pass: env.SENDGRID_API_KEY },
    });
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
}

let transporter: Transporter | null = null;

function getTransport(): Transporter {
  if (!transporter) transporter = createTransport();
  return transporter;
}

export interface SendMailInput {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
  attachments?: Array<{ filename: string; content: Buffer | string; contentType?: string }>;
}

/** Retry with exponential backoff up to 3 attempts. */
async function attempt<T>(fn: () => Promise<T>, tries = 3, delay = 500): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < tries; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i === tries - 1) break;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw lastError;
}

export async function sendMail({ to, subject, template, data, attachments }: SendMailInput): Promise<void> {
  const html = loadTemplate(template)({ ...data, appUrl: env.APP_URL, brandName: 'BHAVITA TEXTILES' });
  const text = html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  if (!isProd && env.EMAIL_PROVIDER === 'smtp' && env.SMTP_HOST === 'localhost') {
    logger.info('[mail:dev] would send', { to, subject, template });
  }

  await attempt(() =>
    getTransport().sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
      attachments,
    }),
  );
}
