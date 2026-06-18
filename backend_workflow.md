# BHAVITA TEXTILES — BACKEND WORKFLOW

**Stack:** Node.js 20 LTS · Express.js + TypeScript · Prisma (or Knex) · MySQL 8.0 · JWT + Refresh Rotation · RBAC · Cloudinary · Razorpay · Winston · Sentry
**Deployment:** Ubuntu 22.04 VPS · Nginx · PM2 · Let's Encrypt SSL · UFW · Fail2ban

> **How to use:** Mark a phase `✅ COMPLETED (YYYY-MM-DD)` ONLY after every checkbox is done and verified. Each phase = **5–6 credits**. Always read `BT_project_plan.md` + `schema.sql` + `frontend_workflow.md` before coding so DB columns, response shapes, and routes line up.

---

## Progress Overview

| #  | Phase                                              | Credits | Status     |
|----|----------------------------------------------------|---------|------------|
| 0  | Foundation Brief & Contract Lock-in                | 2–3     | ⬜ Pending |
| 1  | Project Foundation, MySQL Schema & Migrations      | 5–6     | ⬜ Pending |
| 2  | Authentication System (JWT + Refresh + Email)      | 5–6     | ⬜ Pending |
| 3  | RBAC, Security Middleware & Hardening              | 5–6     | ⬜ Pending |
| 4  | Categories & Products APIs                         | 5–6     | ⬜ Pending |
| 5  | Cloudinary Integration & Media APIs                | 5–6     | ⬜ Pending |
| 6  | Cart, Wishlist, Addresses & Coupon APIs            | 5–6     | ⬜ Pending |
| 7  | Orders, Razorpay & Invoice Generation              | 5–6     | ⬜ Pending |
| 8  | Admin APIs (analytics, orders, coupons, banners)   | 5–6     | ⬜ Pending |
| 9  | Reviews, Wholesale, Newsletter, Contact APIs       | 5–6     | ⬜ Pending |
| 10 | SEO, Logging, Backups & VPS Deployment             | 5–6     | ⬜ Pending |

---

## PHASE 0 — Foundation Brief & Contract Lock-in  `(2–3 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Read `BT_project_plan.md`, `schema.sql`, `frontend_workflow.md` end-to-end
- [ ] Confirm tech: Express + TS + Prisma (or Knex), MySQL 8, Cloudinary, Razorpay, SES/SendGrid/SMTP
- [ ] Lock the API surface (full table in Phase 4–9 plus admin in Phase 8) — every route is `/api/...`
- [ ] Lock response envelope: `{ success, data, meta }` / `{ success:false, error:{code,message,fields} }`
- [ ] Lock RBAC matrix (below), validation (zod), and logging conventions
- [ ] Confirm env var list (see Phase 10) is complete

### RBAC Matrix
| Resource | Customer | Admin | Super Admin |
|--|:--:|:--:|:--:|
| Own profile/addresses/orders/wishlist/reviews | RW | R | R |
| Other users' data | ✗ | R | RW |
| Catalog (categories/products) | R | RW | RW |
| Stock/prices | ✗ | RW | RW |
| All orders | ✗ | RW | RW |
| Coupons/banners/wholesale | ✗ | RW | RW |
| Manage admins / roles / settings / audit | ✗ | R (limited) | RW |

> **Done when:** all decisions above are written into `README.md` of backend repo as a \"contract\" section.

---

## PHASE 1 — Project Foundation, MySQL Schema & Migrations  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Init Node + TypeScript (strict). Folders: `src/{config,middleware,modules,db,utils,types}`, `tests/`, `logs/`
- [ ] Install: express, mysql2, prisma (or knex), zod, dotenv, helmet, cors, express-rate-limit, morgan, winston, winston-daily-rotate-file, bcrypt, jsonwebtoken, cookie-parser, multer, cloudinary, razorpay, pdfkit, nodemailer, @sentry/node
- [ ] Configure MySQL connection pool from env
- [ ] Create migrations from `schema.sql` (one migration per logical group OR import SQL via Prisma `db pull`/`db push` + add hand-written migration)
- [ ] Tables to migrate (must match `schema.sql` exactly): `users`, `refresh_tokens`, `addresses`, `categories`, `products`, `product_images`, `product_variants`, `carts`, `cart_items`, `wishlists`, `orders`, `order_items`, `payments`, `reviews`, `coupons`, `coupon_usages`, `banners`, `wholesale_inquiries`, `newsletter_subscribers`, `contact_messages`, `audit_logs`, `security_logs`
- [ ] Indexes + FKs + FULLTEXT + JSON columns as in `schema.sql`
- [ ] Seed script: 1 super_admin, 1 admin, 1 customer, full category tree from doc, 6 sample products
- [ ] `GET /api/health` returns `{status:'ok', db:'up', uptime, version}`
- [ ] Module skeleton (each module: `routes.ts`, `controller.ts`, `service.ts`, `repository.ts`, `schema.ts`, `types.ts`)

### Module pattern
```
src/modules/<name>/
  routes.ts       // express router, mounts middleware
  controller.ts   // parses req, returns response
  service.ts      // business logic
  repository.ts   // DB queries only (no business logic)
  schema.ts       // zod input/output schemas
  types.ts
  __tests__/
```

> **Done when:** migrations apply cleanly, seed populates, healthcheck 200, sample queries return seeded data.

---

## PHASE 2 — Authentication System (JWT + Refresh + Email)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| POST | `/api/auth/register` | bcrypt hash, send verification email |
| POST | `/api/auth/login` | issue access + refresh |
| POST | `/api/auth/refresh` | rotate refresh, return new access |
| POST | `/api/auth/logout` | revoke refresh |
| GET  | `/api/auth/me` | current user |
| POST | `/api/auth/forgot-password` | email reset token |
| POST | `/api/auth/reset-password` | reset with token |
| GET  | `/api/auth/verify-email` | verify token |
| POST | `/api/auth/resend-verification` | resend |
| POST | `/api/auth/change-password` | auth-required |

### Token rules
- **Access token:** JWT HS256 with `JWT_ACCESS_SECRET`, TTL **15m**, claims `{ sub, role, ver }`
- **Refresh token:** 64 random bytes, stored **hashed (sha256)** in `refresh_tokens`, TTL **7d**, sent as **httpOnly + Secure + SameSite=Lax** cookie
- **Refresh rotation:** every refresh creates new row + revokes old; reused token triggers chain revocation
- **bcrypt rounds ≥ 12**
- **Reset/verification tokens:** 32 random bytes, hashed before storage, single-use, 30-min expiry
- Strong password policy via zod: min 8, upper + lower + digit + symbol

### Email templates (handlebars/MJML)
verify-email · welcome · forgot-password · password-changed · order-placed · order-shipped · order-delivered · order-cancelled · refund-processed · wholesale-inquiry-ack

> **Done when:** all 10 endpoints work via curl/Postman; refresh rotation tested; reused refresh triggers revocation chain; reset email arrives in dev SMTP.

---

## PHASE 3 — RBAC, Security Middleware & Hardening  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Middleware stack (in order)
```
cors → helmet → request-id → morgan → rate-limit → body-parser → cookie-parser
→ auth (optional/required) → role-guard → ownership-guard → validate(zod)
→ controller → response-formatter → error-handler
```

### Tasks
- [ ] `authMiddleware` — verifies JWT, attaches `req.user`
- [ ] `roleMiddleware(['admin','super_admin'])`
- [ ] `ownershipMiddleware` — user can only access own resources (orders, addresses, reviews)
- [ ] Helmet (CSP below) + secure cookie flags
- [ ] CORS strict whitelist from `FRONTEND_ORIGINS` env, `credentials:true`
- [ ] Rate limiting: 5/15min on auth; 10/hour on public forms; 120/min public reads; 300/min auth; 600/min admin
- [ ] zod validation on every endpoint
- [ ] Parameterized queries everywhere
- [ ] Sanitize HTML inputs (DOMPurify on server for rich text)
- [ ] CSRF: SameSite=Lax on refresh cookie + `X-CSRF` header on state-changing routes (or double-submit)
- [ ] Login lockout: 5 failed → 15 min cooldown (by ip+email)
- [ ] Security logs to `security_logs` table

### CSP (helmet)
```
default-src 'self';
img-src 'self' https://res.cloudinary.com data:;
script-src 'self' https://checkout.razorpay.com;
style-src 'self' 'unsafe-inline';
connect-src 'self' https://api.razorpay.com;
frame-ancestors 'none';
```
Plus: HSTS · X-Content-Type-Options: nosniff · X-Frame-Options: DENY · Referrer-Policy: strict-origin-when-cross-origin · Permissions-Policy: camera=(),mic=(),geo=()

### Forbidden capabilities (tested with integration tests, must all return 403/401)
- Customer hitting `/api/admin/*`
- User A reading user B's orders/addresses/reviews
- Modifying order amount / product price / stock from client
- Replaying payment verification
- Uploading SVG / oversized files

> **Done when:** OWASP top-10 mitigations verified, RBAC integration tests pass, lockout works, no admin endpoint is accessible without role.

---

## PHASE 4 — Categories & Products APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Public
| Method | Path | Purpose |
|--|--|--|
| GET | `/api/categories` | Nested tree |
| GET | `/api/categories/:slug` | Detail |
| GET | `/api/products` | List w/ filters `category, q, min_price, max_price, color, size, sort, page, limit, flag` |
| GET | `/api/products/:slug` | PDP (images, variants, rating, count) |
| GET | `/api/collections/:key` | new-arrivals · best-sellers · summer · winter · festive · wedding |
| GET | `/api/banners?placement=` | Active banners |

### Admin
| Method | Path |
|--|--|
| `GET/POST/PATCH/DELETE` | `/api/admin/categories[/:id]` |
| `GET/POST/PATCH/DELETE` | `/api/admin/products[/:id]` |
| `POST/PATCH/DELETE` | `/api/admin/products/:id/variants[/:varId]` |
| `PATCH` | `/api/admin/products/:id/publish` |
| `PATCH` | `/api/admin/products/:id/stock` (atomic increment/decrement) |

### Rules
- Slug auto-generated, unique
- Soft delete via `deleted_at`
- Search uses MySQL FULLTEXT on `name, short_description, description`
- Pagination meta in response

> **Done when:** all endpoints implemented; filters return correct results; slugs unique; integration tests cover happy + edge cases.

---

## PHASE 5 — Cloudinary Integration & Media APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `POST /api/admin/upload/signature` returns `{signature, timestamp, api_key, folder, cloud_name}`
- [ ] Server enforces `folder` allow-list: `bhavita/products`, `bhavita/banners`, `bhavita/categories`
- [ ] Allowed formats: `jpg, jpeg, png, webp, avif` (deny svg)
- [ ] Max size 5 MB; max 10 images per product
- [ ] Filename sanitization (slug + uuid)
- [ ] `POST /api/admin/products/:id/images` to persist `{secure_url, public_id, alt_text, sort_order}`
- [ ] `DELETE /api/admin/products/:id/images/:imgId` → Cloudinary destroy + DB row delete
- [ ] Banner + Category image endpoints
- [ ] Optional weekly orphan sweeper job

> **Done when:** signed upload works, oversized/SVG uploads rejected, deletion cascades to Cloudinary.

---

## PHASE 6 — Cart, Wishlist, Addresses & Coupon APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| GET    | `/api/cart` | Server-computed totals |
| POST   | `/api/cart/items` | Add item (stock checked) |
| PATCH  | `/api/cart/items/:id` | Update qty |
| DELETE | `/api/cart/items/:id` | Remove |
| POST   | `/api/cart/coupon` | Apply coupon |
| DELETE | `/api/cart/coupon` | Remove coupon |
| GET    | `/api/wishlist` | List |
| POST   | `/api/wishlist` | Add `{product_id}` |
| DELETE | `/api/wishlist/:productId` | Remove |
| GET/POST/PATCH/DELETE | `/api/me/addresses[/:id]` | Address book |
| POST   | `/api/me/addresses/:id/default` | Set default |
| POST   | `/api/coupons/validate` | Validate code against cart |

### Rules
- Totals (subtotal, shipping, tax, discount, total) computed server-side **only**
- Cart is bound to user; ownership enforced
- Coupon validation: code valid, within `start_date/end_date`, `is_active`, `min_cart_value` met, `usage_limit/used_count`, `per_user_limit` via `coupon_usages`
- Address `is_default` is mutex per user (single SQL transaction)

> **Done when:** cross-user access returns 403; totals always recomputed server-side; coupon edge cases (expired, exhausted, per-user limit) handled.

---

## PHASE 7 — Orders, Razorpay & Invoice Generation  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints
| Method | Path | Purpose |
|--|--|--|
| POST | `/api/checkout/quote` | Server recomputes totals |
| POST | `/api/checkout/razorpay/order` | Create RP order from server-computed amount |
| POST | `/api/checkout/razorpay/verify` | Verify HMAC, create order, decrement stock |
| POST | `/api/webhooks/razorpay` | Webhook sync (`payment.captured`, `payment.failed`, `refund.created`) |
| GET  | `/api/orders` | Customer's own orders |
| GET  | `/api/orders/:orderNumber` | Detail |
| POST | `/api/orders/:orderNumber/cancel` | Cancel if status allows |
| GET  | `/api/orders/:orderNumber/invoice` | PDF download |

### Razorpay flow
1. Frontend → `/checkout/quote` (server recomputes totals)
2. Frontend → `/checkout/razorpay/order` → server: `razorpay.orders.create({ amount: total*100, currency:'INR', receipt: order_number })` and inserts `payments` row `status='created'`. Returns `{razorpay_order_id, amount, currency, key_id}`
3. Frontend opens Razorpay Checkout
4. On success → `/checkout/razorpay/verify` with `{razorpay_order_id, razorpay_payment_id, razorpay_signature}`
5. Server HMAC: `crypto.createHmac('sha256', secret).update(order_id+'|'+payment_id).digest('hex')` must equal `razorpay_signature`
6. **In a DB transaction:**
   - `SELECT FOR UPDATE` each product/variant; abort if any OOS → refund + email
   - Insert `orders` + `order_items`
   - Update `payments` row (payment_id, signature, `status='captured'`) — unique constraint on `razorpay_payment_id` prevents replay
   - Insert `coupon_usages`, increment `coupons.used_count`
   - Clear cart
7. Send order confirmation email with PDF invoice
8. Return order number

### Order status state-machine
`pending → confirmed → processing → shipped → delivered` OR `cancelled` (allowed from pending/confirmed)

### Idempotency
- Accept `Idempotency-Key` header on verify endpoint
- Unique constraint on `payments.razorpay_payment_id`

### Invoice
- pdfkit/puppeteer generates A4 invoice with line items, taxes, billing/shipping address
- Secured download (auth + ownership)

> **Done when:** end-to-end Razorpay test flow works; signature failures logged; stock decremented atomically; invoice downloads.

---

## PHASE 8 — Admin APIs (analytics, orders, coupons, banners)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Endpoints (all behind `roleMiddleware(['admin','super_admin'])`)
| Group | Routes |
|--|--|
| Dashboard | `GET /api/admin/dashboard` (KPIs + revenue series) |
| Orders | `GET /api/admin/orders`, `GET /api/admin/orders/:id`, `PATCH /api/admin/orders/:id/status`, `POST /api/admin/orders/:id/refund` |
| Customers | `GET /api/admin/customers`, `GET /api/admin/customers/:id` |
| Wholesale | `GET /api/admin/wholesale-inquiries`, `PATCH /api/admin/wholesale-inquiries/:id`, `GET /api/admin/wholesale-inquiries/export.csv` |
| Coupons | `GET/POST/PATCH/DELETE /api/admin/coupons[/:id]` |
| Banners | `GET/POST/PATCH/DELETE /api/admin/banners[/:id]` |
| Reviews | `GET /api/admin/reviews`, `PATCH /api/admin/reviews/:id` (approve/reject) |
| Audit (👑) | `GET /api/admin/audit-logs` |
| Users (👑) | `GET/PATCH /api/admin/users[/:id]` (status, role) |

### Rules
- Every admin write logs to `audit_logs` (actor, action, entity, before/after JSON, ip, user_agent)
- Order status updates send email to customer
- Refund uses Razorpay API; updates `payments.status='refunded'`, `orders.payment_status='refunded'`
- All admin lists paginated + sortable + filterable

> **Done when:** RBAC enforced everywhere; dashboards return real aggregated data; CSV export works; audit log captures every write.

---

## PHASE 9 — Reviews, Wholesale, Newsletter, Contact APIs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

| Method | Path | Notes |
|--|--|--|
| POST   | `/api/products/:id/reviews` | Auth; verified purchaser only (must have a `delivered` order with this product); 1 review per (user, product, order) |
| GET    | `/api/products/:id/reviews` | Paginated, only `status='approved'` |
| PATCH  | `/api/reviews/:id` | Edit own (resets to `pending`) |
| DELETE | `/api/reviews/:id` | Delete own |
| POST   | `/api/wholesale-inquiry` | Public, rate-limited, captcha-ready; emails ops + acks lead |
| POST   | `/api/contact` | Public, rate-limited; stores in `contact_messages`, emails ops |
| POST   | `/api/newsletter/subscribe` | Public, double opt-in optional |

### Rules
- Aggregate avg rating + count updated on review approve/reject (triggers or service)
- Spam protection on all public POSTs (honeypot field + rate-limit + optional reCAPTCHA hook)
- All inputs zod-validated

> **Done when:** every public form stores data, sends correct emails, and is rate-limited.

---

## PHASE 10 — SEO, Logging, Backups & VPS Deployment  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### SEO
- [ ] `GET /sitemap.xml` (dynamic from products + categories + collections) OR delegate to Next.js
- [ ] `GET /robots.txt`
- [ ] JSON-LD helpers for Product, Breadcrumb, Organization

### Logging & Monitoring
- [ ] Winston + daily-rotate-file: `app-*.log`, `error-*.log`, `http-*.log`, `security-*.log`, `payment-*.log` (retain 30d)
- [ ] Morgan piped to http log; sensitive bodies redacted (password, signature)
- [ ] Centralized error handler — safe responses, no stack to client in prod
- [ ] Sentry on backend (`@sentry/node`) with release tags
- [ ] `GET /api/health` + optional `GET /api/health/deep`

### Backups & DR
- [ ] Daily `mysqldump --single-transaction --routines --triggers` → S3/B2/R2 (encrypted, AES-256), retain 14 days
- [ ] Weekly full backup, retain 8 weeks
- [ ] Binlog shipping (optional) for RPO ≤ 5 min
- [ ] Quarterly restore drill on staging

### Env vars (`.env.production`)
```
NODE_ENV, PORT=4000, APP_URL, API_URL, FRONTEND_ORIGINS
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TTL=15m, JWT_REFRESH_TTL=7d, BCRYPT_ROUNDS=12
COOKIE_DOMAIN, COOKIE_SECURE=true
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
EMAIL_PROVIDER, EMAIL_FROM, SMTP_* / SENDGRID_API_KEY / SES_*
SENTRY_DSN, LOG_LEVEL=info
```

### Deployment (Ubuntu 22.04 VPS)
- [ ] Node 20 LTS via nvm, MySQL 8.0, Nginx, PM2, certbot
- [ ] PM2 ecosystem: `bhavita-api` (cluster, max instances, 600M restart) + `bhavita-web` (2 instances)
- [ ] `pm2 startup` + `pm2 save`
- [ ] Nginx reverse proxy: 80→443 redirect, HSTS, CSP, gzip+brotli, `/api/` → `127.0.0.1:4000`, `/` → `127.0.0.1:3000`
- [ ] Let's Encrypt via certbot, auto-renew
- [ ] UFW: allow 22/80/443 only; MySQL bound to 127.0.0.1
- [ ] Fail2ban watching sshd + nginx 401/403
- [ ] Backup cron `0 2 * * *` running `deploy/scripts/backup-db.sh`

### Go-Live Checklist (verify before flipping DNS)
- [ ] SSL A+ on securityheaders.com
- [ ] Razorpay LIVE keys + webhook configured & test ₹1 transaction successful
- [ ] Cloudinary preset + folder allow-list correct
- [ ] Email domain SPF/DKIM/DMARC verified
- [ ] Sentry releases tagging; UptimeRobot pinging `/api/health`
- [ ] Backup cron run + restore drill passed
- [ ] Sitemap + robots reachable; Search Console verified
- [ ] Lighthouse mobile ≥ 90
- [ ] All static pages live and linked
- [ ] Cancel + refund flow tested E2E
- [ ] 100 concurrent reads / 20 concurrent checkouts on staging — no errors
- [ ] Rollback runbook documented + on-call rotation live

> **Done when:** app deployed on HTTPS, PM2 running, backups scheduled and verified by a restore, all checklist items ticked.

---

### Completion Legend
⬜ Pending · 🟡 In Progress · ✅ Completed (YYYY-MM-DD)

### Implementing LLM — Hard Rules
- Never trust prices, stock, or totals from the client — always recompute server-side.
- Verify every Razorpay signature on the server before creating an order.
- Every protected endpoint passes through `authMiddleware` and, where needed, `roleMiddleware` + `ownershipMiddleware`.
- Log every admin action to `audit_logs` and every auth/payment event to `security_logs` / `payment-*.log`.
- Use parameterized queries / ORM everywhere — no string concatenation in SQL.
- DB column names, types, and FKs MUST match `schema.sql` exactly. If you need a change, write a new migration; do not edit existing ones.
