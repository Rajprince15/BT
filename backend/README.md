# BHAVITA TEXTILES · Backend

Node 20 · Express · TypeScript strict · MySQL 8.0.
Full contract in [`/app/backend_workflow.md`](../backend_workflow.md).
Frontend expectations in [`/app/frontend/src/services/__contract__.md`](../frontend/src/services/__contract__.md).

## Quick start (do NOT run yet — codebase only)

```bash
cd /app/backend
cp .env.example .env
# fill DB_* + RAZORPAY_* + CLOUDINARY_* + SMTP_*/SENDGRID_*
pnpm install
pnpm migrate     # applies src/db/migrations/001_initial.sql
pnpm seed        # optional: seeds admin / demo customer / catalog
pnpm dev         # or `pnpm build && pnpm start`
```

The migration is idempotent (a `schema_migrations` table records applied
files). The seed script uses `INSERT … ON DUPLICATE KEY UPDATE` and safe
existence checks so re-running it is safe.

## Routes at a glance

| Area | Prefix | Notes |
|---|---|---|
| Health | `/api/health`, `/api/health/deep` | Liveness + DB ping |
| Auth | `/api/auth/*` | Register/login/refresh/logout/me + reset + verify (Section 5) |
| Catalog | `/api/categories`, `/api/products`, `/api/collections/:key` | Public read, ETag/`Cache-Control` (Phase 4A) |
| Cart | `/api/cart/*` | Server-computed totals (Phase 6A) |
| Wishlist | `/api/wishlist/*` | Authenticated |
| Addresses | `/api/me/addresses/*` | Single-default invariant enforced (Phase 6B) |
| Checkout | `/api/checkout/quote`, `/api/checkout/razorpay/*` | Idempotency + amount lock (Phase 7A) |
| Orders | `/api/orders/*` | List/detail/cancel/reorder/invoice PDF (Phase 7B) |
| Reviews | `/api/reviews/*` | Verified-purchaser + moderation (Phase 9) |
| Public forms | `/api/wholesale-inquiry`, `/api/contact`, `/api/newsletter/*` | Honeypot + rate limits (Phase 9) |
| Banners | `/api/banners` | Placement-filtered, cached (Phase 9) |
| Media | `/api/upload/signature`, `/api/upload/persist` | Cloudinary signed upload (Phase 5) |
| Admin | `/api/admin/*` | Dashboard/products/orders/customers/banners/reviews/wholesale/users/audit/settings (Phase 8A/B) |
| Webhooks | `/api/webhooks/razorpay` | Raw-body verify + refund handling |
| SEO | `/api/sitemap.xml`, `/api/robots.txt` | Cached 5 min |

## Security posture (Section 2 recap)

- `helmet` with strict CSP (Cloudinary + Razorpay whitelisted only).
- `cors` origin whitelist from `FRONTEND_ORIGINS` (comma-separated).
- JWT access tokens (`HS256`, TTL 15m) + rotating refresh tokens in
  `httpOnly; SameSite=Lax` cookies, hashed in DB.
- Reuse-detection revokes the entire refresh-token chain.
- bcrypt (cost 12) + login lockout after 5 failures / 15 min.
- Zod validation at every endpoint; server-side `sanitizeHtml` on
  free-text fields (reviews, wholesale, contact).
- Razorpay signature verified with `crypto.timingSafeEqual`, webhook uses
  `express.raw` to preserve the exact bytes.
- All admin writes recorded in `audit_logs`; login/refresh events recorded
  in `security-*.log` (Winston daily rotate).

## Docker / deploy

```bash
docker compose up -d
```

The compose file provisions MySQL and this API, mounts
`src/db/migrations` as initdb, and applies the health check on the API.
`ecosystem.config.js` runs the same code under PM2 in cluster mode.
`deploy/nginx.conf` and `deploy/scripts/backup-db.sh` are the reference
edge configuration and nightly backup entry-point.

## Environment (see `.env.example`)

Non-obvious defaults:
- `EMAIL_PROVIDER=smtp` → Mailhog on `localhost:1025` in dev.
- `COOKIE_SECURE=false` in dev, must flip to `true` in prod.
- `RATE_LIMIT_*` values come from `.env`; tighten in staging/prod.

## Tests

`pnpm test` runs Vitest against `src/**`. Test suites are intentionally
scaffolded but not run in this codebase-only pass — the user asked me to
write the code and not start anything.
