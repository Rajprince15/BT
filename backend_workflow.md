# BHAVITA TEXTILES — BACKEND WORKFLOW (SINGLE SOURCE OF TRUTH)

> **Read me first.** This file is **self-sufficient**. Everything from `BT_Project_plan.md` that is backend-relevant is inlined here. The companion `schema.sql` defines the database; the companion `frontend_workflow.md` mirrors this contract on the UI side. **Do not split logic into more files.**

---

## ⚠️ HARD RULE — FRONTEND SERVICE LAYER IS THE CONTRACT (READ FIRST)

This project follows a **Frontend-First** workflow. By the time backend work begins, the entire frontend is already built and approved using **mock data** behind a typed **Service Layer** (`frontend/services/*.service.ts`). The backend's job is **not** to design APIs from scratch — it is to make the existing service functions stop hitting mocks and start hitting real endpoints, **without any UI, page, component, hook, or type changing**.

### What this means in practice

1. **Source of truth for response shapes** = `frontend/types/*.ts` + `frontend/services/__contract__.md`. Every backend response payload (the `data` field of the envelope) MUST match the corresponding TypeScript interface field-for-field. If a field name or type differs, **fix the backend**, never the frontend.
2. **Source of truth for endpoints** = `frontend/services/__contract__.md`. It lists, for every service function, the exact HTTP method, path, query params, body shape, and response shape. Every endpoint in this workflow MUST appear there; every entry there MUST be implemented here.
3. **No frontend file outside `services/`, `lib/api.ts`, `lib/env.ts`, and `.env` is allowed to change at backend-integration time.** If the backend forces a UI change, the contract was broken — fix the backend.
4. **Field naming convention.** DB columns are `snake_case` (per `schema.sql`); TypeScript interfaces are `camelCase`. The backend response layer MUST convert `snake_case` ↔ `camelCase` (use a serializer / mapping function in every repository → controller boundary). The mapping is enumerated in `frontend/types/_mapping.md`.
5. **Response envelope is mandatory** for every endpoint, success or error:
   ```
   Success: { "success": true, "data": <payload matching TS interface>, "meta": <pagination/optional> }
   Error:   { "success": false, "error": { "code": "STRING_CODE", "message": "human", "fields": {fieldName: "msg"} } }
   ```
   The frontend's mock services already use this envelope verbatim, so any deviation breaks the swap.
6. **Status codes & error codes are part of the contract.** The frontend's UI states (OOS, 401-refresh, 403 RBAC, etc.) are wired to specific error `code` strings. Reuse the catalog from `frontend/services/__contract__.md` and Section 5 of this file.
7. **Backend acceptance criterion (per phase):** after deploying a phase's endpoints, set the frontend's `NEXT_PUBLIC_USE_MOCKS=false` (or per-service feature flag) and run the corresponding frontend flow. **Zero UI changes** must be required. If the UI breaks, the response shape is wrong — fix the backend.

### Phase-to-Service map (every backend phase ships endpoints for these frontend services)

| Backend Phase | Frontend service(s) it satisfies |
|---|---|
| 2A · 2B | `services/auth.service.ts` |
| 3A · 3B | (cross-cutting middleware — no service-shape change, just real enforcement) |
| 4A | `services/product.service.ts`, `services/category.service.ts`, `services/banner.service.ts` (read side) |
| 4B | `services/admin/product.service.ts`, `services/admin/category.service.ts` |
| 5  | `services/upload.service.ts`, image-persist endpoints under `services/admin/product.service.ts` & `services/admin/banner.service.ts` |
| 6A | `services/cart.service.ts` |
| 6B | `services/wishlist.service.ts`, `services/user.service.ts` (addresses) |
| 7A | `services/checkout.service.ts` |
| 7B | `services/order.service.ts` (list/detail/cancel/invoice + webhooks) |
| 8A | `services/admin/dashboard.service.ts`, `services/admin/order.service.ts`, `services/admin/customer.service.ts` |
| 8B | `services/admin/banner.service.ts`, `services/admin/review.service.ts`, `services/admin/wholesale.service.ts`, `services/admin/audit.service.ts`, `services/admin/settings.service.ts` |
| 9  | `services/review.service.ts`, `services/wholesale.service.ts`, `services/newsletter.service.ts`, `services/contact.service.ts` |
| 10A · 10B | (ops only — no service-shape impact) |

### Mandatory verification step at the end of every phase

- [ ] Run the frontend against the new endpoints with `NEXT_PUBLIC_USE_MOCKS=false` (or the per-service flag for this phase) and confirm:
  - Every page rendered by services in scope shows correct data.
  - Zero changes were needed to any file outside `frontend/services/**`, `frontend/lib/api.ts`, `frontend/lib/env.ts`, or `frontend/.env`.
  - If a field had to be renamed or remapped, do it in the backend response layer — **never** in the frontend.

> If during implementation any phase requires a frontend interface change, **STOP**, raise it as a contract amendment, update `frontend/types/*.ts` + `services/__contract__.md` + the mock data in one PR, and only then continue. Do not silently diverge.

---
---

## 0. PROJECT CONTEXT (do not skip)

**Brand:** BHAVITA TEXTILES — premium luxury textile & home-furnishing e-commerce.
**Positioning:** *Handcrafted Home Textiles & Decor for Elegant Living* (alt: *Premium Handloom, Home Furnishing & Handicrafts*).
**This is NOT a college project.** Treat every line as production code: real customers, real payments, real inventory. When a choice exists between "quick" and "secure/production-grade", **always pick production-grade**.

**Target users:** Retail Customers · Wholesale/Bulk Buyers · Interior Designers · Hotels & Resorts · Corporate Buyers · Administrators.

**Quality bar:** Production Ready · Scalable · Secure · Modular · Maintainable · Well Documented · Enterprise Grade.

---

## 1. TECH STACK (LOCKED)

| Layer | Choice |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js + TypeScript (strict). *Next.js API Routes acceptable only if frontend & backend ship together; the rest of this doc assumes Express.* |
| ORM/Query | Prisma **or** Knex (pick one and stay) |
| DB | MySQL 8.0 (InnoDB · utf8mb4 · utf8mb4_unicode_ci) |
| Auth | JWT access + Refresh-token rotation · bcrypt (rounds ≥ 12) |
| RBAC | `customer` · `admin` · `super_admin` |
| File Storage | Cloudinary (signed uploads only) |
| Payments | Razorpay (test → live) |
| Email | SMTP / SendGrid / Amazon SES (configurable) |
| Logging | Winston + winston-daily-rotate-file · Morgan |
| Monitoring | Sentry (`@sentry/node`) · UptimeRobot |
| PDF | pdfkit (invoices) |
| Validation | zod on every request |
| Deployment | Ubuntu 22.04 VPS · Nginx · PM2 · Let's Encrypt · UFW · Fail2ban |

---

## 2. ENTERPRISE SECURITY REQUIREMENTS (NON-NEGOTIABLE)

### Access Control (RBAC)
Roles: **Super Admin · Admin · Customer**. Enforce on every server route — never trust the client.

| Resource | Customer | Admin | Super Admin |
|---|:--:|:--:|:--:|
| Own profile/addresses/orders/wishlist/reviews | RW | R | R |
| Other users' data | ✗ | R | RW |
| Catalog (categories/products) | R | RW | RW |
| Stock/prices | ✗ | RW | RW |
| All orders | ✗ | RW | RW |
| Banners/wholesale | ✗ | RW | RW |
| Manage admins / roles / settings / audit | ✗ | R (limited) | RW |

**Hard rules:**
- Users **never** access admin pages by URL manipulation.
- Users **never** access another user's data, orders, addresses, reviews.
- Users **never** modify prices, totals, or stock from the client.
- Every protected route passes `authMiddleware` → `roleMiddleware` → `ownershipMiddleware` → `zod-validate`.

### Authentication
- **Access JWT:** HS256, secret `JWT_ACCESS_SECRET`, TTL **15 min**, claims `{ sub, role, ver }`.
- **Refresh token:** 64 random bytes, stored as **SHA-256 hash** in `refresh_tokens`, TTL **7 days**, delivered as `httpOnly · Secure · SameSite=Lax` cookie.
- **Rotation:** every refresh issues a new token + revokes the old; reuse of a revoked token → revoke the whole chain.
- **Logout** revokes the refresh token row.
- **Email verification** & **password reset** tokens: 32 random bytes, hashed, single-use, 30-min expiry.
- **Strong password policy:** min 8, upper + lower + digit + symbol (zod).
- **bcrypt rounds ≥ 12.**

### API Security
- Rate limiting (see Phase 3B).
- zod request validation on every endpoint.
- Input sanitization (DOMPurify on rich-text fields server-side).
- Output encoding by default (JSON; no HTML).
- Parameterized queries / ORM **only** — never string concatenation.

### Protection Against (OWASP Top 10 mitigations REQUIRED)
SQL Injection · XSS · CSRF · SSRF · Clickjacking · Session Hijacking · Broken Authentication · Broken Access Control · Directory Traversal · File Upload Exploits.

### File Upload Security (Cloudinary)
- Image MIME validation (jpg, jpeg, png, webp, avif). **Deny SVG.**
- Max size 5 MB · max 10 images per product.
- Filename sanitization (slug + uuid).
- Folder allow-list (`bhavita/products`, `bhavita/banners`, `bhavita/categories`).
- Malware-scan hook support (configurable).
- Cloudinary upload preset restricts formats + size at the provider level.

### Security Logging (`security_logs` table + `security-*.log`)
Log: login attempts, failed logins, password changes, admin actions, product updates, order status changes, lockouts, suspicious requests.

---

## 3. PAYMENT SECURITY REQUIREMENTS

**Never trust the client for payment data.**
- Order amount computed **only** on the backend from the current DB cart.
- Cart re-validated immediately before payment.
- Razorpay signature **must** be HMAC-verified on the server.
- Order row created **only after** signature verification.
- Stock decremented **only after** payment confirmation (`SELECT ... FOR UPDATE` inside a transaction).
- Prevent duplicate payments — `payments.razorpay_payment_id` is `UNIQUE`.
- Prevent replay — accept `Idempotency-Key` header on the verify endpoint.
- Invoices generated server-side, secured by auth + ownership.

---

## 4. PRODUCTION DATABASE REQUIREMENTS

- Proper indexing on every FK and high-read column (see `schema.sql`).
- Foreign keys + ON DELETE rules as in `schema.sql`.
- DB CHECK constraints (price ≥ 0, qty > 0, rating 1–5).
- Soft deletes via `deleted_at` (users, categories, products).
- Audit tables (`audit_logs`, `security_logs`).
- Transactions for: order creation, stock decrement, refund.
- Rollback strategy: any failure inside the checkout transaction reverts stock + payment row state.

### Query Optimization Plan
- FULLTEXT index on `products(name, short_description, description)` for search.
- Composite indexes on `(featured, best_seller, new_arrival)` and `(order_status)`, `(payment_status)`.
- Use covering indexes for listing pages where possible.
- Avoid N+1: batch fetch product images/variants by product id list.

### Backup Strategy
- Daily `mysqldump --single-transaction --routines --triggers` → encrypted S3/B2/R2 (AES-256), 14-day retention.
- Weekly full backup, 8-week retention.
- Optional binlog shipping (RPO ≤ 5 min).
- Quarterly restore drill on staging.

---

## 5. API CONTRACT (SHARED WITH FRONTEND)

### Response envelope
```
Success: { "success": true, "data": <payload>, "meta": <pagination/optional> }
Error:   { "success": false, "error": { "code": "STRING_CODE", "message": "human", "fields": {fieldName: "msg"} } }
```
All routes are mounted under `/api`.

### Module pattern (per feature)
```
src/modules/<name>/
  routes.ts       // express router; attaches middleware
  controller.ts   // parse req, return response
  service.ts      // business logic
  repository.ts   // DB queries only
  schema.ts       // zod input/output
  types.ts
  __tests__/
```

---

## 6. ENV VARIABLES (`.env.production`)

```
NODE_ENV=production
PORT=4000
APP_URL=https://bhavitatextiles.com
API_URL=https://bhavitatextiles.com/api
FRONTEND_ORIGINS=https://bhavitatextiles.com

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bhavita_textiles
DB_USER=
DB_PASS=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
BCRYPT_ROUNDS=12

COOKIE_DOMAIN=.bhavitatextiles.com
COOKIE_SECURE=true

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_PROVIDER=smtp        # smtp | sendgrid | ses
EMAIL_FROM="Bhavita Textiles <no-reply@bhavitatextiles.com>"
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SENDGRID_API_KEY=

SENTRY_DSN=
LOG_LEVEL=info
```

---

## 7. EXECUTION PROGRESS

> Each phase ≈ **5–6 credits**. Mark a phase `✅ COMPLETED (YYYY-MM-DD)` ONLY after every checkbox is done and verified. Heavy phases were split into A/B sub-phases so every phase stays within budget — **no feature has been removed**.

| #    | Phase                                                              | Credits | Status     |
|------|--------------------------------------------------------------------|---------|------------|
| 0    | Foundation Brief & Contract Lock-in                                | 2–3     | ⬜ Pending |
| 1A   | Project Foundation, TS Setup & MySQL Migrations                    | 5–6     | ⬜ Pending |
| 1B   | Seed Data, Module Skeletons & Healthcheck                          | 5–6     | ⬜ Pending |
| 2A   | Auth Core (register / login / refresh / logout / me / change-pwd)  | 5–6     | ⬜ Pending |
| 2B   | Password Reset, Email Verification & All Email Templates           | 5–6     | ⬜ Pending |
| 3A   | Auth, Role, Ownership Middleware & zod Validation Layer            | 5–6     | ⬜ Pending |
| 3B   | Helmet/CSP, CORS, Rate-Limit, CSRF, Lockout, Security Logs         | 5–6     | ⬜ Pending |
| 4A   | Public Categories & Products APIs (filters, FULLTEXT, collections) | 5–6     | ⬜ Pending |
| 4B   | Admin Categories & Products CRUD, Variants, Stock & Publish        | 5–6     | ⬜ Pending |
| 5    | Cloudinary Integration & Media APIs                                | 5–6     | ⬜ Pending |
| 6A   | Cart APIs (server-computed totals)                                 | 5–6     | ⬜ Pending |
| 6B   | Wishlist & Address Book APIs                                       | 5–6     | ⬜ Pending |
| 7A   | Checkout Quote, Razorpay Order Create, Verify & Stock Transaction  | 5–6     | ⬜ Pending |
| 7B   | Orders (list/detail/cancel), RP Webhooks & PDF Invoice             | 5–6     | ⬜ Pending |
| 8A   | Admin Dashboard KPIs, Orders & Customers APIs                      | 5–6     | ⬜ Pending |
| 8B   | Admin Banners, Reviews, Wholesale Mgmt & Audit Logs                | 5–6     | ⬜ Pending |
| 9    | Reviews, Wholesale Inquiry, Newsletter & Contact APIs              | 5–6     | ⬜ Pending |
| 10A  | SEO Endpoints, Logging & Monitoring (Winston/Sentry/Healthchecks)  | 5–6     | ⬜ Pending |
| 10B  | Backups, Docker, VPS Deployment (Nginx/PM2/SSL) & Go-Live          | 5–6     | ⬜ Pending |

---

## PHASE 0 — Foundation Brief & Contract Lock-in  `(2–3 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Read this file + `schema.sql` + `frontend_workflow.md` end-to-end.
- [ ] Confirm tech: Express + TS + Prisma (or Knex), MySQL 8, Cloudinary, Razorpay, SMTP/SendGrid/SES.
- [ ] Lock the API surface (full table in Phases 2/4/6/7/8/9) — every route under `/api`.
- [ ] Lock response envelope (Section 5) and error codes catalog.
- [ ] Lock RBAC matrix (Section 2) and write it into the backend `README.md` as a "contract" section.
- [ ] Confirm env var list (Section 6) is complete in `.env.example`.

> **Done when:** all decisions above are in `README.md` and shared with the frontend implementer.

---

## PHASE 1A — Project Foundation, TS Setup & MySQL Migrations  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Init Node + TypeScript (strict). Folders: `src/{config,middleware,modules,db,utils,types}`, `tests/`, `logs/`, `deploy/`.
- [ ] Install: `express mysql2 prisma (or knex) zod dotenv helmet cors express-rate-limit morgan winston winston-daily-rotate-file bcrypt jsonwebtoken cookie-parser multer cloudinary razorpay pdfkit nodemailer @sentry/node uuid`.
- [ ] Configure MySQL connection pool from env (size 10, queueLimit 0).
- [ ] Create migrations from `schema.sql` (one migration per logical group OR import via Prisma `db pull`/`db push` + hand-written migration).
-[ ] Tables MUST exist exactly as `schema.sql`: `users`, `refresh_tokens`, `addresses`, `categories`, `products`, `product_images`, `product_variants`, `carts`, `cart_items`, `wishlists`, `orders`, `order_items`, `payments`, `reviews`, `banners`, `wholesale_inquiries`, `newsletter_subscribers`, `contact_messages`, `audit_logs`, `security_logs`.
- [ ] Verify all indexes, FKs, FULLTEXT, JSON columns, CHECK constraints.
- [ ] Configure ESLint + Prettier + strict `tsconfig`.
- [ ] `.env.example` mirrors Section 6 exactly.

> **Done when:** migrations apply cleanly on a fresh DB; `npm run build` passes with zero TS errors.

---

## PHASE 1B — Seed Data, Module Skeletons & Healthcheck  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Seed script: 1 super_admin, 1 admin, 1 customer (bcrypt-hashed passwords).
- [ ] Seed **full category tree** (Section 10): Bedroom (Bedsheets, Blankets & Comforters, Pillows & Bedding Accessories) · Living Room (Soft Furnishings, Curtains, Rugs & Carpets, Door Mats) · Bath (Towels, Bath Mats) · Home Decor · Handloom Heritage · Handicrafts · Special Collections — including every sub-category listed.
- [ ] Seed 6 sample products with images + variants + price + sale_price + stock + flags (featured/best_seller/new_arrival).
- [ ] Seed 1 active home_hero banner.
 [ ] Module skeleton for every backend module (Section 5): `auth · users · categories · products · media · cart · wishlist · addresses · checkout · orders · payments · reviews · wholesale · newsletter · contact · admin · banners · audit`.
- [ ] Bootstrap Express app: body-parser, cookie-parser, request-id, base error handler, response envelope util (Section 5).

> **Done when:** seed populates idempotently, `/api/health` returns 200, sample queries against seeded data succeed in a Postman smoke run.

---

## PHASE 2A — Auth Core (register / login / refresh / logout / me / change-password)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| POST | `/api/auth/register` | bcrypt hash, create user (unverified), enqueue verification email |
| POST | `/api/auth/login` | issue access + refresh; reject if `email_verified=0` (configurable grace) |
| POST | `/api/auth/refresh` | rotate refresh, return new access |
| POST | `/api/auth/logout` | revoke refresh row |
| GET  | `/api/auth/me` | current user (auth-required) |
| POST | `/api/auth/change-password` | auth-required; old + new; revokes all refresh rows |

### Rules
- Access JWT: HS256, 15 min, `{sub, role, ver}`.
- Refresh: 64 random bytes, SHA-256-hashed in `refresh_tokens`, 7-day TTL, `httpOnly Secure SameSite=Lax` cookie.
- Rotation on every refresh; reuse of revoked token → chain-revoke + security log.
- bcrypt rounds ≥ 12; strong password (min 8, upper + lower + digit + symbol).

> **Done when:** 6 endpoints pass Postman; refresh rotation tested; reused refresh triggers chain revoke; change-password invalidates all sessions.

---

## PHASE 2B — Password Reset, Email Verification & Email Templates  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| POST | `/api/auth/forgot-password` | email reset token (32 random bytes, hashed in DB, 30-min expiry, single-use) |
| POST | `/api/auth/reset-password` | reset with token; revoke all refresh tokens |
| GET  | `/api/auth/verify-email` | verify email token |
| POST | `/api/auth/resend-verification` | resend (rate-limited) |

### Email service
- [ ] Pluggable provider: `smtp` / `sendgrid` / `ses` via `EMAIL_PROVIDER`.
- [ ] Queue-friendly send wrapper (retry x3 with backoff) + dev MailHog/Mailtrap config.

### Email templates (handlebars / MJML)
- [ ] `verify-email`
- [ ] `welcome`
- [ ] `forgot-password`
- [ ] `password-changed`
- [ ] `order-placed` (with invoice PDF attachment hook)
- [ ] `order-shipped`
- [ ] `order-delivered`
- [ ] `order-cancelled`
- [ ] `refund-processed`
- [ ] `wholesale-inquiry-ack`

All templates: responsive, gold/ivory brand styling, plain-text fallback, brand logo, footer with unsubscribe link.

> **Done when:** reset → email → token works E2E; verify-email link works; all 10 templates render in dev mail UI.

---

## PHASE 3A — Auth, Role, Ownership Middleware & zod Validation Layer  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Middleware order
```
cors → helmet → request-id → morgan → rate-limit → body-parser → cookie-parser
→ auth (optional/required) → role-guard → ownership-guard → validate(zod)
→ controller → response-formatter → error-handler
```

### Tasks
- [ ] `authMiddleware` — verifies JWT, attaches `req.user`; supports optional vs required mode.
- [ ] `roleMiddleware(['admin','super_admin'])` — role-based gate.
- [ ] `ownershipMiddleware` — user accesses only own resources (orders, addresses, reviews, cart, wishlist) by checking `user_id` on the resource before the controller runs.
- [ ] zod request validator (body, query, params) wired into every existing & future endpoint.
- [ ] Centralized error handler returning the Section-5 envelope; **no stack trace to client in prod**.
- [ ] Response formatter helper for `{success:true, data, meta?}`.
- [ ] HTML sanitization (DOMPurify) on any rich-text input (product description, review).
- [ ] Parameterized queries / ORM enforced across modules (lint rule + code review checklist).

### Forbidden-capability integration tests (must all return 401/403)
- Customer hitting `/api/admin/*`
- User A reading user B's orders / addresses / reviews
- Modifying order amount, product price, stock from client
- Calling protected endpoints with no token / expired token

> **Done when:** RBAC + ownership integration tests pass; zod validation rejects malformed payloads with structured `fields` errors.

---

## PHASE 3B — Helmet/CSP, CORS, Rate-Limit, CSRF, Lockout, Security Logs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Helmet with full CSP below + secure cookie flags.
- [ ] CORS strict whitelist from `FRONTEND_ORIGINS`, `credentials: true`.
- [ ] Rate limiting: 5/15-min on auth; 10/hour on public forms (wholesale, contact, newsletter); 120/min public reads; 300/min auth; 600/min admin.
- [ ] CSRF: `SameSite=Lax` refresh cookie + `X-CSRF` header (or double-submit) on state-changing routes.
- [ ] Login lockout: 5 failed → 15-min cooldown by `(ip, email)`; bump `users.failed_login_count` / `lockout_until`.
- [ ] File-upload guards (Phase 5 enforces Cloudinary side too): MIME, size, filename sanitization at the controller boundary.
- [ ] Security logs to `security_logs` table + `security-*.log`: login attempts, failed logins, lockouts, password changes, admin writes, role changes, suspicious requests.
- [ ] Replay-attack protection helper (Idempotency-Key parser for Phase 7A).

### CSP (helmet)
```
default-src 'self';
img-src 'self' https://res.cloudinary.com data:;
script-src 'self' https://checkout.razorpay.com;
style-src 'self' 'unsafe-inline';
connect-src 'self' https://api.razorpay.com;
frame-ancestors 'none';
```
Plus: HSTS · `X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(),mic=(),geo=()`.

> **Done when:** securityheaders.com scan ≥ A; lockout proven via 6-failure test; rate-limits trip on flood; CSP allows Razorpay & Cloudinary only.

---

## PHASE 4A — Public Categories & Products APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| GET | `/api/categories` | Nested tree (parent → children) |
| GET | `/api/categories/:slug` | Detail + immediate children |
| GET | `/api/products` | List w/ filters `category, q, min_price, max_price, color, size, sort, page, limit, flag` |
| GET | `/api/products/:slug` | PDP payload (images, variants, avg rating, review count) |
| GET | `/api/collections/:key` | new-arrivals · best-sellers · summer · winter · festive · wedding |
| GET | `/api/banners?placement=` | Active banners filtered by `start_at/end_at` and `is_active=1` |

### Rules
- Slugs unique; soft-deleted rows excluded by default.
- Search uses MySQL FULLTEXT (`MATCH ... AGAINST` BOOLEAN MODE) on `products(name, short_description, description)`.
- Pagination meta `{ page, limit, total, totalPages }` in response.
- Avoid N+1: batch fetch product images/variants by product id list.
- Cache headers (`Cache-Control: public, max-age=60, stale-while-revalidate=300`) on public reads.

> **Done when:** filters return correct results; FULLTEXT search works; collections route returns correct flag-based data; banners respect schedule window.

---

## PHASE 4B — Admin Categories & Products CRUD, Variants, Stock & Publish  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path |
|--|--|
| `GET/POST/PATCH/DELETE` | `/api/admin/categories[/:id]` (nested categories supported via `parent_id`) |
| `POST` | `/api/admin/categories/:id/image` (Cloudinary URL persist) |
| `GET/POST/PATCH/DELETE` | `/api/admin/products[/:id]` |
| `POST/PATCH/DELETE` | `/api/admin/products/:id/variants[/:varId]` (size, color, stock, price override) |
| `PATCH` | `/api/admin/products/:id/publish` (status = `draft` ↔ `published`) |
| `PATCH` | `/api/admin/products/:id/stock` (atomic increment/decrement; audit-logged) |

### Rules
- Slug auto-generated from name; uniqueness enforced.
- Soft delete via `deleted_at`.
- Every write logged to `audit_logs` with actor/before/after JSON.
- zod-validated payloads; SKU unique; price ≥ 0; stock ≥ 0.

### Product Upload Workflow (Admin) — full sequence
1. **Enter info:** name, description, short_description, category_id, SKU, price, sale_price, stock, flags.
2. **Upload images:** request signed params from `/api/admin/upload/signature` (Phase 5) → upload directly to Cloudinary → persist `{secure_url, public_id, alt, sort_order}` via `POST /api/admin/products/:id/images`.
3. **Create variants:** size, color, stock, optional price override.
4. **Publish:** `PATCH /api/admin/products/:id/publish` → `status='published'`.

> **Done when:** non-admin gets 403 on every admin endpoint; CRUD flow + publish + stock adjust all work; audit log records each write.

---

## PHASE 5 — Cloudinary Integration & Media APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `POST /api/admin/upload/signature` returns `{ signature, timestamp, api_key, folder, cloud_name }`.
- [ ] Server-enforced folder allow-list (`bhavita/products`, `bhavita/banners`, `bhavita/categories`).
- [ ] Allowed formats: `jpg jpeg png webp avif` — **deny svg**.
- [ ] Max size 5 MB; max 10 images per product (enforced in service).
- [ ] Filename sanitization (slug + uuid before upload).
- [ ] `POST /api/admin/products/:id/images` persists `{secure_url, public_id, alt_text, sort_order}` (capped at 10).
- [ ] `DELETE /api/admin/products/:id/images/:imgId` → `cloudinary.uploader.destroy(public_id)` + DB delete.
- [ ] Banner image endpoints (`/api/admin/banners` upload flow).
- [ ] Category image endpoint (`/api/admin/categories/:id/image`).
- [ ] Optional weekly orphan sweeper cron — deletes Cloudinary assets not referenced in DB.
- [ ] Malware-scan hook stub (configurable webhook before persist).

> **Done when:** signed upload works; oversized / SVG uploads rejected; deletion cascades to Cloudinary; orphan sweeper script runs on demand.

---

## PHASE 6A — Cart APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| GET    | `/api/cart` | Server-computed totals: subtotal, shipping, tax, total |
| POST   | `/api/cart/items` | Add item (stock checked; variant supported) |
| PATCH  | `/api/cart/items/:id` | Update qty (stock re-checked) |
| DELETE | `/api/cart/items/:id` | Remove |

### Rules
- Totals are **server-computed only** (subtotal · shipping policy · GST/tax · total).
- Cart bound to `user_id`; ownership enforced.
- Cart item snapshot keeps unit price for stable totals between adds and checkout quote.

> **Done when:** cross-user access returns 403; totals always recomputed.

---

## PHASE 6B — Wishlist & Address Book APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| GET    | `/api/wishlist` | List items with product summary |
| POST   | `/api/wishlist` | Add `{product_id}` (idempotent) |
| DELETE | `/api/wishlist/:productId` | Remove |
| POST   | `/api/wishlist/:productId/move-to-cart` | Move to cart |
| GET/POST/PATCH/DELETE | `/api/me/addresses[/:id]` | Address CRUD |
| POST   | `/api/me/addresses/:id/default` | Set default (single SQL transaction; unsets siblings) |

### Rules
- Wishlist unique on `(user_id, product_id)`.
- Address `is_default` is mutually exclusive per user.
- Pincode validated (India 6-digit) via zod regex.
- Soft delete on addresses keeps order history intact.

> **Done when:** ownership enforced (User A cannot touch User B); default-flip is transactional; pincode validation rejects bad input.

---

## PHASE 7A — Checkout Quote, Razorpay Order Create, Verify & Stock Transaction  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| POST | `/api/checkout/quote` | Server recomputes totals (subtotal · shipping · tax · discount · total) |
| POST | `/api/checkout/razorpay/order` | Create RP order from server-computed amount; insert `payments` row `status='created'` |
| POST | `/api/checkout/razorpay/verify` | Verify HMAC, create order, decrement stock atomically |

### Razorpay flow (canonical)
1. Frontend → `POST /api/checkout/quote` (server recomputes totals from DB cart + selected address).
2. Frontend → `POST /api/checkout/razorpay/order` — server calls `razorpay.orders.create({ amount: total*100, currency:'INR', receipt: order_number })` and inserts a `payments` row with `status='created'`. Returns `{ razorpay_order_id, amount, currency, key_id }`.
3. Frontend opens Razorpay Checkout with returned params.
4. On success → `POST /api/checkout/razorpay/verify` with `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` and `Idempotency-Key` header.
5. Server HMAC: `crypto.createHmac('sha256', RP_SECRET).update(order_id + '|' + payment_id).digest('hex')` **must equal** `razorpay_signature`.
6. **Inside a DB transaction:**
   - `SELECT ... FOR UPDATE` on each product/variant; abort + refund + email if any OOS.
   - Insert `orders` + `order_items` (immutable snapshot of product name/SKU/price).
   - Update `payments` row (`payment_id`, `signature`, `status='captured'`). UNIQUE on `razorpay_payment_id` blocks replay.

   - Clear cart.
7. Enqueue `order-placed` email with invoice PDF (Phase 7B builds PDF).
8. Return `{order_number}`.

### Idempotency / Replay
- `Idempotency-Key` header on verify endpoint stored in payments meta.
- Unique constraint on `payments.razorpay_payment_id` blocks dupes.
- Log every step to `payment-*.log` (redact signature).

> **Done when:** Razorpay test mode flow works E2E; signature mismatch returns 400 + security log; stock decremented atomically; replay attempt returns 409.

---

## PHASE 7B — Orders (list/detail/cancel), RP Webhooks & PDF Invoice  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| GET  | `/api/orders` | Customer's own orders (paginated, status-filterable) |
| GET  | `/api/orders/:orderNumber` | Detail (auth + ownership) |
| POST | `/api/orders/:orderNumber/cancel` | Cancel if status in `{pending, confirmed}`; restore stock atomically |
| GET  | `/api/orders/:orderNumber/invoice` | PDF download (auth + ownership) |
| POST | `/api/webhooks/razorpay` | Webhook sync (`payment.captured`, `payment.failed`, `refund.created`); HMAC-verified with `RAZORPAY_WEBHOOK_SECRET` |

### Order status state-machine
`pending → confirmed → processing → shipped → delivered` OR `cancelled` (allowed from `pending`/`confirmed` only).

### Invoice (pdfkit)
- A4 PDF with brand header (gold + ivory), line items, taxes, billing/shipping address, order number, payment id, timestamp, terms footer.
- Download secured by auth + ownership.

### Webhook handler
- Verify signature header `x-razorpay-signature`.
- Idempotent: dedupe by `payments.razorpay_payment_id` + event id.
- Drives `payments.status` and (on refund) `orders.payment_status='refunded'`.
- Log every event to `payment-*.log`.

> **Done when:** customer can view + cancel + download invoice; webhook idempotently updates payment status; cancel restores stock in a transaction.

---

## PHASE 8A — Admin Dashboard KPIs, Orders & Customers APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

All routes behind `roleMiddleware(['admin','super_admin'])`.

| Group | Routes |
|--|--|
| Dashboard | `GET /api/admin/dashboard` — KPIs (total sales, orders, customers, products) + revenue time-series (day/week/month) + top-selling products |
| Orders | `GET /api/admin/orders` (filter by status/date/customer), `GET /api/admin/orders/:id`, `PATCH /api/admin/orders/:id/status`, `POST /api/admin/orders/:id/refund` (calls Razorpay refund API) |
| Customers | `GET /api/admin/customers` (search/sort/paginate), `GET /api/admin/customers/:id` (profile + order history + lifetime value) |

### Rules
- Order status updates send the appropriate customer email (`order-shipped`, `order-delivered`, `order-cancelled`).
- Refund updates `payments.status='refunded'` + `orders.payment_status='refunded'` + audit log + customer email (`refund-processed`).
- All admin lists paginated + sortable + filterable (URL-driven).
- Every write logs to `audit_logs` with before/after JSON.

> **Done when:** dashboards return real aggregates; status transitions enforced server-side; refund flow tested in Razorpay test mode.

---

## PHASE 8B — Admin Banners, Reviews, Wholesale Mgmt, Users & Audit Logs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

All routes behind `roleMiddleware(['admin','super_admin'])`.

| Group | Routes |
|--|--|

| Banners | `GET/POST/PATCH/DELETE /api/admin/banners[/:id]` — placement (`home_hero`, `category`, `promotional`), image, link, schedule (`start_at`, `end_at`), sort_order |
| Reviews | `GET /api/admin/reviews`, `PATCH /api/admin/reviews/:id` (approve/reject) — triggers avg-rating recompute |
| Wholesale | `GET /api/admin/wholesale-inquiries`, `PATCH /api/admin/wholesale-inquiries/:id` (status: new → contacted → converted/closed), `GET /api/admin/wholesale-inquiries/export.csv` |
| Users 👑 | `GET/PATCH /api/admin/users[/:id]` — change status/role (super_admin only) |
| Audit 👑 | `GET /api/admin/audit-logs` — paginated, filter by actor/entity/date (super_admin only) |

### Rules
- 👑 = super_admin only. Hard gate; admin gets 403.
- Every write logs to `audit_logs`.
- CSV export streams (no full in-memory) for big inquiry lists.

> **Done when:** all CRUD works; super-admin-only endpoints reject admin; CSV export downloads valid file; review approve/reject reflects in PDP rating.

---

## PHASE 9 — Reviews, Wholesale, Newsletter & Contact APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

| Method | Path | Notes |
|--|--|--|
| POST   | `/api/products/:id/reviews` | Auth; **verified purchaser only** (must have a `delivered` order containing this product); 1 review per `(user, product, order)`; default `status='pending'` |
| GET    | `/api/products/:id/reviews` | Paginated, only `status='approved'` |
| PATCH  | `/api/reviews/:id` | Edit own (resets `status='pending'`) |
| DELETE | `/api/reviews/:id` | Delete own |
| POST   | `/api/wholesale-inquiry` | Public, rate-limited, captcha-ready; emails ops + acks lead (`wholesale-inquiry-ack`) |
| POST   | `/api/contact` | Public, rate-limited; stores in `contact_messages`, emails ops |
| POST   | `/api/newsletter/subscribe` | Public, optional double opt-in |
| GET    | `/api/newsletter/unsubscribe?token=` | Unsubscribe via signed token |

### Rules
- Avg rating + count updated on review approve/reject (via service or DB trigger).
- Spam protection on **every** public POST: honeypot field + rate-limit + optional reCAPTCHA hook (`RECAPTCHA_SECRET`).
- All inputs zod-validated.
- Wholesale fields: company_name, contact_person, email, phone, business_type (Hotel/Resort/Hospital/Hostel/Retail/Interior Designer/Corporate Gifting/Other), product_interest, quantity_requirement, message.

> **Done when:** verified-purchaser rule blocks non-buyers; every public form stores data, sends correct emails, and is rate-limited; unsubscribe link works.

---

## PHASE 10A — SEO Endpoints, Logging & Monitoring  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### SEO (backend responsibilities)
- [ ] `GET /sitemap.xml` — dynamic from products + categories + collections + static pages (OR delegated to Next.js if frontend handles it; pick one and document).
- [ ] `GET /robots.txt` — disallow `/admin`, `/account`, `/cart`, `/checkout`, `/api`.
- [ ] JSON-LD helpers (server-rendered into product/category responses): `Product`, `BreadcrumbList`, `Organization`, `WebSite+SearchAction` — consumed by frontend `generateMetadata`.
- [ ] Canonical URL helper for product / category endpoints.
- [ ] Open Graph + Twitter Card meta fields included in product/category payload for frontend consumption.

### Logging & Monitoring
- [ ] Winston + daily-rotate-file:
  - `app-*.log` (info+)
  - `error-*.log` (error)
  - `http-*.log` (Morgan piped here)
  - `security-*.log` (auth, lockout, suspicious)
  - `payment-*.log` (RP order/verify/webhook)
  - Retain 30 days · gzip rotated.
- [ ] Sensitive bodies redacted (password, signature, token, cookie).
- [ ] Centralized error handler — safe responses; **no stack to client in prod**.
- [ ] Sentry on backend (`@sentry/node`) with release tags + environment + user context (id only).
- [ ] `GET /api/health` (shallow) + `GET /api/health/deep` (DB + Cloudinary + RP ping).
- [ ] Audit-log viewer query path (read side already shipped in Phase 8B).

> **Done when:** sitemap + robots reachable; Rich Results test passes on a sample product; Sentry receives a forced error; rotated logs visible in `logs/`.

---

## PHASE 10B — Backups, Docker, VPS Deployment & Go-Live  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Backups & Disaster Recovery
- [ ] Daily `mysqldump --single-transaction --routines --triggers` → encrypted S3/B2/R2 (AES-256), retain 14 days.
- [ ] Weekly full backup, retain 8 weeks.
- [ ] Media: rely on Cloudinary's redundancy + monthly inventory snapshot.
- [ ] Optional binlog shipping (RPO ≤ 5 min).
- [ ] Quarterly restore drill on staging — documented + signed off.
- [ ] Backup cron `0 2 * * *` runs `deploy/scripts/backup-db.sh`.

### Docker (parity)
- [ ] `Dockerfile` for backend (multi-stage build, non-root user).
- [ ] `docker-compose.yml` for local + staging (api + mysql + mailhog).
- [ ] Healthchecks in compose; volumes for MySQL data + logs.

### Deployment (Ubuntu 22.04 VPS)
- [ ] Node 20 LTS via nvm · MySQL 8.0 · Nginx · PM2 · certbot · UFW · Fail2ban.
- [ ] PM2 ecosystem file: `bhavita-api` (cluster mode, `max_instances`, `max_memory_restart: 600M`) + `bhavita-web` (2 instances).
- [ ] `pm2 startup` + `pm2 save`.
- [ ] Nginx reverse proxy:
  - 80 → 443 redirect
  - HSTS · CSP · gzip + brotli
  - `/api/` → `127.0.0.1:4000`
  - `/`     → `127.0.0.1:3000`
- [ ] Let's Encrypt via certbot, auto-renew (`systemctl status certbot.timer`).
- [ ] UFW: allow 22 / 80 / 443 only; MySQL bound to `127.0.0.1`.
- [ ] Fail2ban watching `sshd` + nginx 401/403.
- [ ] Deployment checklist + rollback runbook in `deploy/README.md`.

### Go-Live Checklist (verify before flipping DNS)
- [ ] SSL A+ on `securityheaders.com`.
- [ ] Razorpay LIVE keys + webhook configured; test ₹1 transaction successful.
- [ ] Cloudinary preset + folder allow-list correct.
- [ ] Email domain SPF / DKIM / DMARC verified.
- [ ] Sentry release tags; UptimeRobot pinging `/api/health`.
- [ ] Backup cron ran + restore drill passed.
- [ ] Sitemap + robots reachable; Search Console verified.
- [ ] Lighthouse mobile ≥ 90 (handled by frontend).
- [ ] All static pages live + linked in footer (frontend).
- [ ] Cancel + refund flow tested E2E.
- [ ] 100 concurrent reads / 20 concurrent checkouts on staging — no errors.
- [ ] Rollback runbook documented + on-call rotation live.

> **Done when:** app deployed on HTTPS, PM2 running, backups verified by a restore, all checklist items ticked.

---

## 8. CUSTOMER FEATURES (reference; APIs above already cover these)

**Auth:** Register · Login · Forgot Password · Reset Password · Email Verification.
**Profile:** Edit Profile · Address Management · Order History.
**Shopping:** Product Search · Category Filtering · Price Filtering · Add/Update/Remove Cart · Wishlist · Product Reviews · Ratings.
**Checkout:** Address Selection · Razorpay Payment · Order Confirmation · Invoice Download.

## 9. WHOLESALE / B2B FEATURES

Public form `/api/wholesale-inquiry` fields: company_name, contact_person, email, phone, business_type, product_interest, quantity_requirement, message.
Admin manages via `/api/admin/wholesale-inquiries` (list, update status, export CSV).
Target customers: Hotels · Resorts · Hospitals · Hostels · Retail Stores · Interior Designers · Corporate Gifting.

---

## 10. CATALOG REFERENCE (for seed + admin pre-fill)

Used by Phase 1B seed and admin category create UI.

**Bedroom Collection**
- Bedsheets: Cotton · Handloom · Printed · Premium Collection · King Size · Queen Size · Kids Collection
- Blankets & Comforters: Cotton Blankets · Winter Blankets · AC Blankets · Quilts · Dohars
- Pillows & Bedding Accessories: Pillow Covers · Cushion Covers · Bed Runners

**Living Room Collection**
- Soft Furnishings: Sofa Throws · Sofa Covers · Cushion Covers
- Curtains: Sheer · Blackout · Cotton · Printed · Luxury
- Rugs & Carpets: Handwoven Rugs · Cotton Rugs · Floor Rugs · Area Rugs · Carpets · Runner Carpets
- Door Mats: Cotton · Anti-Slip · Decorative · Outdoor

**Bath Collection**
- Towels: Bath · Hand · Face · Luxury · Hotel
- Bath Mats

**Home Decor**
Wall Decor · Table Linen · Decorative Textiles · Handmade Decor · Festive Decor · Cushion Styling Collection.

**Handloom Heritage Collection**
Jaipur Prints · Block Print Collection · Artisan Collection · Ethnic Weaves · Traditional Handloom.

**Handicrafts Collection**
Handmade Home Accessories · Decorative Items · Traditional Craft Collection · Gift Collection.

**Special Collections**
New Arrivals · Best Sellers · Summer · Winter · Festive · Wedding.

---

## 11. DELIVERABLES (sign-off list)

1. Complete MySQL schema (`schema.sql`) — ✅ in repo
2. Backend folder structure (Phase 1A/1B)
3. Backend APIs (Phases 2A → 9)
4. Authentication system (Phases 2A + 2B)
5. RBAC + security middleware (Phases 3A + 3B)
6. Razorpay integration (Phases 7A + 7B)
7. Cloudinary integration (Phase 5)
8. Database migrations & seed (Phases 1A + 1B)
9. Deployment guide for Ubuntu VPS (Phase 10B)
10. Nginx configuration (Phase 10B)
11. PM2 configuration (Phase 10B)
12. Environment variable strategy (Section 6)
13. Docker setup (Phase 10B)
14. Production checklist (Phase 10B)
15. Logging, monitoring, backups (Phases 10A + 10B)

---

### Completion Legend
⬜ Pending · 🟡 In Progress · ✅ Completed (YYYY-MM-DD)

### Implementing LLM — Hard Rules
- **The frontend Service Layer is the contract.** Every response shape MUST match the TS interface in `frontend/types/*` field-for-field. Convert snake_case → camelCase in the response layer; never push DB column names to the client.
- **No frontend file outside `services/`, `lib/api.ts`, `lib/env.ts`, `.env` may change** when this backend is wired in. If you cannot meet that, raise a contract amendment instead of silently breaking the UI.
- Never trust prices, stock, or totals from the client — always recompute server-side.
- Verify every Razorpay signature on the server before creating an order.
- Every protected endpoint passes `authMiddleware` → `roleMiddleware` (where needed) → `ownershipMiddleware` (where needed) → `zod-validate`.
- Log every admin action to `audit_logs` and every auth/payment event to `security_logs` / `payment-*.log`.
- Use parameterized queries / ORM only — no string concatenation in SQL.
- DB column names, types, and FKs **MUST** match `schema.sql` exactly. Need a change? Write a new migration; don't edit old ones.
- One module = one folder (`routes / controller / service / repository / schema / types`). Do **not** sprinkle files outside this pattern.
