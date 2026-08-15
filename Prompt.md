# KICKOFF_PROMPT.md — Bhavita Textiles

> Read me first. This is the **single continuation prompt** for any LLM working
> on this repo. It is deliberately opinionated. Follow the ORDER of the sections
> below. Do not skip.

---

## 0. WHERE THIS REPO IS RIGHT NOW (as of 2026-01-15)

- **Only the frontend has been built** — Next.js 15 App Router + TypeScript
  strict + Tailwind + React Query + Axios + Zod + React Hook Form +
  Zustand + shadcn/ui + Motion + Sentry + lucide-react + sonner.
- The frontend runs entirely against **mocks** via `NEXT_PUBLIC_USE_MOCKS=true`.
  No backend exists in this workspace: `/app/backend` is **absent by design**.
- The **MySQL 8.0 schema** already exists at `/app/schema.sql`. The
  **backend contract** is defined in `/app/backend_workflow.md`. The **frontend
  service contract** is defined in `/app/frontend/src/services/__contract__.md`.
  These three files together are the source of truth for the future backend.
- **Package manager: pnpm** (see `/app/frontend/pnpm-lock.yaml`). Do not switch
  to yarn or npm.
- The three prior documentation files (`Prompt.md`, `frontend_workflow.md`,
  `backend_workflow.md`) had drifted from reality. This rewrite reconciles them.
  `frontend_workflow.md` still describes phases; **this file describes state**.

### ⛔ Hard scope limits for the next LLM

The user is currently in the **frontend phase**. Until the user explicitly
signals otherwise, you **must not**:

1. Create, modify, or reference any file inside `/app/backend/**`.
2. Add MySQL migrations, ORM setup, or DB connectors.
3. Wire real authentication, real Razorpay, real Cloudinary, or any real
   third-party network call.
4. Change supervisor configuration or start/stop supervisor services.
5. Change ports, hosts, or the `MONGO_URL`/`DB_NAME` handling in `.env`.
6. Rename or delete existing service files, hooks, types, or mocks —
   only extend them.
7. Add `axios` / `fetch` calls or `mocks/*` imports **outside** of
   `src/services/**`. The ESLint architectural bans in
   `frontend_workflow.md` §1A must remain enforceable.

You **may**:

- Add, edit, or reorganise files under `/app/frontend/src/**` and
  `/app/frontend/public/**`.
- Update this file, `frontend_workflow.md`, `backend_workflow.md`, and
  `src/services/__contract__.md` **when — and only when — you can point at
  verified working code that supports the change**.
- Install additional frontend packages via `pnpm add <pkg>` if truly required.

---

## 1. FIRST ACTIONS FOR ANY LLM PICKING THIS UP

Do these, in order, before touching code:

1. Read this file end-to-end.
2. Read `/app/frontend_workflow.md` (frontend contract).
3. Read `/app/backend_workflow.md` (backend contract — read-only for now).
4. Read `/app/schema.sql` and `/app/frontend/src/services/__contract__.md`.
5. Run a placeholder scan and print the result before making changes:
   ```bash
   cd /app/frontend && grep -rn "Coming Soon\|TODO\|FIXME" src \
     --include="*.tsx" --include="*.ts"
   ```
6. Restate the current scope back to the user in one paragraph before writing
   any code. Do not assume the workflow’s ✅ markers are accurate — verify.

---

## 2. CURRENT FRONTEND STATE — PHASE CHECKLIST

Legend: ✅ verified in code · 🟡 partial (see notes) · ⬜ not yet done.

| # | Phase | State | Verified evidence |
|---|---|:-:|---|
| 0 | Foundation Brief & Contract Lock-in | ✅ | `Prompt.md`, `frontend_workflow.md`, `backend_workflow.md`, `schema.sql`, `services/__contract__.md` all present and consistent. |
| 1A | Project Setup, Luxury Design System & Service-Layer Scaffold | ✅ | `next.config.mjs`, `tailwind.config.ts`, `src/styles/tokens.css`, `src/providers/*`, `src/lib/api.ts`, `src/lib/env.ts`. |
| 1B | TypeScript Entities, Mocks & Service Wiring | ✅ | `src/types/*`, `src/mocks/*`, `src/services/*`, dev diagnostic at `src/app/_diag`. |
| 2  | Global Layout, Header, Mega-menu, Footer & Theming | ✅ | `src/components/layout/*`, `src/app/layout.tsx`. |
| 3A | Home — Hero, Featured Categories, New Arrivals, Best Sellers | ✅ | `src/components/home/*`, `src/app/page.tsx`. |
| 3B | Home — Seasonal, Handloom Heritage, Testimonials, Brand Story, Wholesale CTA, Newsletter | ✅ | same folder as 3A. |
| 4  | Shop / Category PLP, Filters, Sort, Pagination, Search, Collections | ✅ | `src/app/(shop)/**`, `src/components/shop/*`. |
| 5A | PDP — Gallery, Info, Variants, Add to Cart/Wishlist, Tabs | 🟡 | `src/app/(shop)/product/[slug]/page.tsx` + `src/components/product/*`. **Missing:** fullscreen gallery modal, sticky mobile add-to-cart bar. |
| 5B | PDP — Reviews UI, Write-Review Form, Related, JSON-LD, Share, Breadcrumbs | 🟡 | `WriteReview.tsx` implemented in this pass. **Still missing:** share buttons (WhatsApp / copy link / email), `BreadcrumbList` JSON-LD, `generateMetadata` OG/Twitter cards, canonical URL. |
| 6  | Authentication Pages & Mock Auth Flow | ✅ | `src/app/(auth)/**` (register / login / forgot / reset / verify), `src/services/auth.service.ts`, `middleware.ts`. |
| 7A | Cart & Wishlist Pages | ✅ | `src/app/cart/page.tsx`, `src/app/(account)/account/wishlist/page.tsx`, `src/services/{cart,wishlist}.service.ts`. |
| 7B | Checkout Multi-step Flow, Mock Razorpay UI, Success & Invoice | ✅ | `checkout/page.tsx` rewritten as 3-step stepper (Address → Shipping → Review); `components/checkout/CheckoutStepper.tsx`, `MockRazorpayModal.tsx`, `ReviewStep.tsx`; invoice download via `lib/invoice.ts` on `/checkout/success`. |
| 8A | Account — Layout, Profile, Addresses, Change Password, Notifications | ✅ | `src/app/(account)/account/**`, `src/components/account/*` (all rewritten in this pass — no more placeholders). |
| 8B | Account — Orders List/Detail, Cancel, Re-order, Reviews-to-write, Wishlist Page | ✅ | Orders list/detail work. Cancel + Re-order + Invoice buttons added to `/account/orders/[orderNumber]` (2026-01-15). Write-review is now available via `components/product/WriteReview.tsx` — wire from `/account/reviews` when the UX pattern is chosen (modal vs. dedicated page). |
| 9A | Admin — Layout, Dashboard KPIs, Categories, Products CRUD (Mock Upload) | ✅ | `src/app/(admin)/admin/**`, `src/components/admin/*` (all rewritten in this pass — no more placeholders). |
| 9B | Admin — Orders, Customers, Wholesale, Banners, Reviews, Audit, Settings | ✅ | same. |
| 10A | Static Pages & Public Forms | ✅ | `src/app/(marketing)/**` (about, contact, privacy, terms, return-policy, shipping-policy, wholesale) — all rewritten in this pass. |
| 10B | SEO, Performance, Accessibility & Polish | 🟡 | `sitemap.ts`, `robots.ts`, product JSON-LD, brand fonts, `Breadcrumbs` JSON-LD on shop routes. **Added 2026-01-15:** `lib/seo.ts`, `components/common/JsonLd.tsx`, root layout emits Organization + WebSite+SearchAction JSON-LD, route-group `layout.tsx` files add `noindex` metadata to (auth), (account), (admin), cart, checkout, and `(shop)/product/[slug]/layout.tsx` exports `generateMetadata` with OG/Twitter/canonical per product. **Still pending:** per-route `generateMetadata` for the (shop) landing routes, `next/image` blur placeholders on editorial images, Lighthouse ≥ 90 pass, WCAG-AA contrast audit. |
| 11 | Backend Integration Swap | ⬜ | Do not start until the user opens the backend phase. |

---

## 3. WHAT WAS CHANGED IN THIS PASS (2026-01-15)

Two consecutive passes on the same date. Neither pass ran the app — code was
written only.

### Pass 1 — placeholder sweep

Everything in the first pass was **placeholder replacement** — no service
contracts, types, mocks, or existing working code were modified.

### New / rewritten files

Account components:
- `src/components/account/AccountSidebar.tsx`
- `src/components/account/OrderCard.tsx`
- `src/components/account/AddressCard.tsx`
- `src/components/account/ChangePasswordForm.tsx`

Product:
- `src/components/product/WriteReview.tsx`

Checkout:
- `src/components/checkout/ShippingStep.tsx`

Admin building blocks:
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/DataTable.tsx`
- `src/components/admin/KpiCard.tsx`
- `src/components/admin/ImageUploader.tsx`
- `src/components/admin/ReviewModerationRow.tsx`
- `src/components/admin/CouponForm.tsx` (UI-only stub — coupons are not in
  `schema.sql`; do not persist)
- `src/components/admin/ProductForm.tsx`
- `src/components/admin/BannerForm.tsx`
- `src/components/admin/OrderStatusUpdater.tsx`

Admin pages:
- `src/app/(admin)/admin/layout.tsx`
- `src/app/(admin)/admin/dashboard/page.tsx`
- `src/app/(admin)/admin/products/page.tsx`
- `src/app/(admin)/admin/products/new/page.tsx`
- `src/app/(admin)/admin/products/[id]/page.tsx`
- `src/app/(admin)/admin/categories/page.tsx`
- `src/app/(admin)/admin/orders/page.tsx`
- `src/app/(admin)/admin/orders/[id]/page.tsx`
- `src/app/(admin)/admin/banners/page.tsx`
- `src/app/(admin)/admin/reviews/page.tsx`
- `src/app/(admin)/admin/customers/page.tsx`
- `src/app/(admin)/admin/wholesale-inquiries/page.tsx`
- `src/app/(admin)/admin/audit-logs/page.tsx` (super_admin only)
- `src/app/(admin)/admin/settings/page.tsx` (super_admin only)

Marketing pages:
- `src/app/(marketing)/about/page.tsx`
- `src/app/(marketing)/contact/page.tsx`
- `src/app/(marketing)/privacy/page.tsx`
- `src/app/(marketing)/terms/page.tsx`
- `src/app/(marketing)/return-policy/page.tsx`
- `src/app/(marketing)/shipping-policy/page.tsx`
- `src/app/(marketing)/wholesale/page.tsx`

Every interactive element in the above screens carries a `data-testid`.

### What was NOT run in this pass (per user’s direction)

- `pnpm dev`, `pnpm build`, `pnpm start` — **not executed**. The user asked
  only to write the code. The next LLM must run `pnpm build` before any
  claim of “ready”.
- No supervisor restart.
- No backend or MySQL work.

### Pass 2 — Checkout Stepper + Order actions + SEO metadata

New files:
- `src/lib/seo.ts` — metadata + JSON-LD builders (Organization, WebSite,
  BreadcrumbList).
- `src/components/common/JsonLd.tsx` — inline schema.org injector.
- `src/lib/invoice.ts` — shared browser Blob-download helper.
- `src/components/checkout/CheckoutStepper.tsx` — 3-step stepper header.
- `src/components/checkout/MockRazorpayModal.tsx` — mocked Razorpay modal
  with success / cancel / failure outcomes.
- `src/components/checkout/ReviewStep.tsx` — final Review & Pay screen.
- `src/app/(auth)/layout.tsx` — noindex group layout.
- `src/app/(account)/layout.tsx` — noindex group layout.
- `src/app/(admin)/layout.tsx` — noindex group layout.
- `src/app/cart/layout.tsx` — noindex.
- `src/app/checkout/layout.tsx` — noindex.
- `src/app/(shop)/product/[slug]/layout.tsx` — server `generateMetadata`
  with OG + Twitter cards + canonical per product slug.

Rewritten files:
- `src/app/layout.tsx` — emits Organization + WebSite+SearchAction JSON-LD
  into `<body>`.
- `src/app/checkout/page.tsx` — full 3-step flow: `AddressStep` →
  `ShippingStep` → `ReviewStep`, then opens `MockRazorpayModal`, verifies
  the payment via `checkoutService.verifyPayment`, and redirects to
  `/checkout/success?orderId=…`.
- `src/app/checkout/success/page.tsx` — added **Download invoice** button
  wired to `orderService.downloadInvoice` via `lib/invoice.ts`.
- `src/app/(account)/account/orders/[orderNumber]/page.tsx` — added
  **Cancel order** (visible when status ∈ {pending, confirmed}, uses
  `useCancelOrder`), **Re-order** (uses `useBulkAddToCart` and pushes to
  `/cart`), and **Download invoice** buttons.

### What was NOT run in either pass (per user’s direction)

- `pnpm dev`, `pnpm build`, `pnpm start` — **not executed**. The user asked
  only to write the code. The next LLM must run `pnpm build` before any
  claim of “ready”.
- No supervisor restart.
- No backend or MySQL work.

---

## 4. WHAT’S LEFT ON THE FRONTEND — PRIORITISED

### P0 — safe to finish now against mocks

1. **PDP polish (5A + 5B leftovers)**
   - Fullscreen gallery modal with keyboard + swipe navigation.
   - Sticky mobile add-to-cart bar.
   - Share buttons (WhatsApp / copy link / email — no external SDKs, just
     `navigator.clipboard` + `mailto:` + `https://wa.me/`).

2. **Checkout stepper polish (7B leftovers)** — ✅ base stepper, mock
   Razorpay modal, and invoice download shipped 2026-01-15. Remaining
   niceties: order-summary "edit" affordances on the summary aside,
   a saved-address quick picker in the Address step, and error-recovery
   copy for Razorpay failure state.

3. **Account order polish (8B leftovers)** — ✅ Cancel / Re-order / Invoice
   buttons shipped 2026-01-15. Remaining: wire the account `/reviews`
   page **Write review** button to the `WriteReview` component (modal or
   dedicated page), and add per-item "buy again" affordances.

4. **SEO / a11y / performance (10B leftovers)** — ✅ Organization,
   WebSite+SearchAction, per-product OG/Twitter/canonical, and noindex on
   private route groups shipped 2026-01-15. Remaining:
   - Add `generateMetadata` for shop landing (`/shop`, `/collections/[key]`,
     `/search`) so each has bespoke titles/descriptions.
   - Ensure every `<img>`/`next/image` has descriptive `alt` and `sizes`.
   - Verify WCAG-AA contrast for gold-on-ivory pairings.
   - Lighthouse ≥ 90 pass.

### P1 — nice to have, still frontend-only

5. Split `AccountShell` into presentation-only wrapper + `AccountSidebar`
   (`AccountSidebar` was created in this pass and can now be used inside
   the existing shell — safe to refactor without breaking service calls).
6. Central endpoint constants file (`src/services/_endpoints.ts`) so the
   backend swap in Phase 11 only touches strings, not service bodies.
7. Add Playwright happy-path scripts under `frontend/tests/e2e/` — but do
   not run them until the user green-lights e2e.

### ⛔ Do NOT do (until user opens backend phase)

- Do not build `/app/backend/**`.
- Do not implement real payments, real uploads, real emails.
- Do not toggle `NEXT_PUBLIC_USE_MOCKS=false`.
- Do not add SQL migrations or Prisma/Knex config.
- Do not open supervisor config.

---

## 5. FRONTEND ↔ BACKEND API CONTRACT (KEEP STABLE)

The frontend already calls the endpoints listed in
`src/services/__contract__.md`. When the backend phase opens, only **service
internals** flip from mocks → Axios. **Do not change:**

- The response envelope: `{ success, data, meta? }` on success and
  `{ success: false, error: { code, message, fields? } }` on failure.
- Field casing: **camelCase on the wire**. The backend must convert
  `snake_case ↔ camelCase` in its response layer.
- Endpoint paths, HTTP verbs, or param names in `__contract__.md`.
- Type shapes in `src/types/**` — these mirror `schema.sql` row shapes.

### Contract mismatches recorded (must be honoured by future backend)

These come from a real audit of `services/__contract__.md` against
`backend_workflow.md` and `schema.sql`. Do **not** silently paper over them:

| Area | What the frontend already expects | Backend must implement as |
|---|---|---|
| Product search | `GET /api/products/search?q=` | Either the same path OR `GET /api/products?q=` — the frontend service must be adjusted (only in `product.service.ts`) if backend picks the second option. |
| Product related | `GET /api/products/:id/related` | Add a real route with the same shape, OR keep it inside `product.service.ts` as a derived helper. |
| Cart bulk | `POST /api/cart/bulk` | Either add the endpoint OR loop `POST /api/cart/items` from inside `cart.service.ts`. |
| Wishlist toggle | `POST /api/wishlist/toggle` | Add the endpoint OR reduce it to a `POST` + `DELETE` pair inside `wishlist.service.ts`. |
| Addresses | `GET/POST/PATCH/DELETE /api/users/addresses[/:id]` | Backend workflow uses `/api/me/addresses`. Align inside `user.service.ts` internals only. |
| Order cancel | `PATCH /api/orders/:orderNumber/cancel` | Backend workflow uses `POST`. Align inside `order.service.ts` internals only. |
| Reviews | `GET /api/reviews/product/:id`, `POST /api/reviews/product/:id`, `PATCH/DELETE /api/reviews/:id` | Backend workflow uses `/api/products/:id/reviews`. Align inside `review.service.ts` internals only. |
| Wholesale | `POST /api/wholesale` | Backend workflow uses `/api/wholesale-inquiry`. Align inside `wholesale.service.ts` internals only. |
| Uploads | `GET /api/upload/signature`, `POST /api/upload`, `POST /api/upload/persist` | Backend workflow uses `/api/admin/upload/signature` + admin image persist routes. Align inside `upload.service.ts` internals only. |

In every case above, **UI callers must not change**. If a change to a caller
becomes necessary, that is a contract amendment — stop and raise it with the
user first.

---

## 6. MOCK CREDENTIALS (frontend phase)

From `src/mocks/users.mock.ts` — usable with `NEXT_PUBLIC_USE_MOCKS=true`:

| Role | Email | Password |
|---|---|---|
| Customer | `customer@bhavita.test` | `Customer@123` |
| Admin | `admin@bhavita.test` | `Admin@1234` |
| Super Admin | `super@bhavita.test` | `Super@1234` |

The mock auth service accepts any password for these emails today. If you
tighten this in mock code, mirror the credentials above and update this
file **and** `docs/mock-credentials.md`.

---

## 7. HARD RULES (RECAP — MEMORISE)

1. Pages, layouts, hooks, and components **never** import from `@/mocks/*`,
   never call `axios`, never call `fetch`, and never hardcode endpoint
   strings. Only files in `src/services/**` do.
2. Every service function has the **same signature** for mock and real —
   only the body switches on `useMockService` (from `_mock-runtime.ts`).
3. The TypeScript interface in `src/types/**` is the **single source of
   truth** shared by mock, service, hook, page, and eventual backend.
4. Never trust the client for price / total / stock — render what the
   service returned. `cartService.get()` and `checkoutService.quote()`
   compute totals; the UI displays them verbatim.
5. Never store the access token in `localStorage`. Access tokens live only
   in memory via `lib/api.ts`. Refresh tokens will be `httpOnly` cookies
   at the backend stage.
6. Every interactive element MUST expose a unique `data-testid` in
   kebab-case. This is enforced by convention across the codebase.
7. Mirror `schema.sql` field names in `types/**` exactly (camelCase in TS ↔
   snake_case in DB). If you rename a field, update `types/_mapping.md`.
8. Brand bar: serif headings (Cormorant Garamond / Playfair Display),
   Manrope / DM Sans body, royal-gold + ivory + deep-navy, restrained
   motion. **No AI-slop purple gradients, no Inter/Roboto/Arial, no
   default shadcn look.**
9. Do not run the app in this pass. The user runs it themselves.

---

## 8. HOW TO SHIP EACH FURTHER CHANGE

For every future change on the frontend:

1. Print a one-paragraph plan (files you will touch, service functions
   you will call).
2. If the change is data-related, confirm the relevant service function
   already exists in `__contract__.md`. If not, either:
   - extend the service (mock only, no new endpoint) and update the
     contract row, or
   - stop and raise a contract amendment.
3. Write the code. Keep components small (< 50 lines where reasonable),
   reuse existing UI primitives (`src/components/common/*`,
   `src/components/ui/*`).
4. Run `pnpm build` (do **not** run `pnpm dev` unless the user asks).
5. Update the Phase Checklist in §2 of this file with the new state.

---

## 9. FILES YOU MUST NOT DELETE

- Anything under `/app/frontend/src/services/**`.
- Anything under `/app/frontend/src/types/**`.
- Anything under `/app/frontend/src/mocks/**`.
- `/app/frontend/src/lib/api.ts`, `env.ts`, `auth.ts`, `rbac.ts`,
  `react-query.ts`.
- `/app/frontend/middleware.ts`.
- `/app/schema.sql`, `/app/backend_workflow.md`, `/app/frontend_workflow.md`,
  this file.

Removing any of the above breaks the frontend-first contract with the future
backend team.

---

## 10. QUALITY BAR

Production Ready · Scalable · Secure · Modular · Maintainable · Well
documented · Enterprise grade. If a shortcut would compromise security,
performance, or the frontend/backend contract, refuse the shortcut and
implement the correct version.

> If anything is ambiguous, prefer the workflow files over your own
> assumptions. If still ambiguous, ask **one clear question** listing the
> options. Do not invent stack pieces, table columns, endpoints, or routes
> that are not already in `schema.sql`, `backend_workflow.md`,
> `frontend_workflow.md`, or `services/__contract__.md`.
