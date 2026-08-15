# Bhavita Textiles — PRD (frontend phase)

## Problem statement (verbatim)
> check my repo complete implementation and analyze what's left according to the workflow to implement or continue only for the frontend and it should be compatible with backend if i use later so check backend workflow too … only frontend implementation for now should be mentioned in the prompt.md and made sure that its compatible and working with backend when i work with backend workflow md file

## User choices captured (2026-01-15)
- Scope: audit + rewrite `Prompt.md` **and** fix obvious frontend gaps found.
- Backend contract: cross-check services against `schema.sql` + `backend_workflow.md` and document mismatches inside `Prompt.md`.
- `Prompt.md` format: checklist + short narrative context.
- Explicitly forbid the next LLM from touching backend / MySQL / supervisor.
- Package manager: **pnpm**.
- Do **not** run the app in this pass — only write the code.

## Architecture (frontend, current)
- Next.js 15 (App Router) + TypeScript strict.
- Tailwind + shadcn/ui + lucide-react + Motion.
- React Query + Axios (services only) + Zustand + React Hook Form + Zod.
- Sentry client / server / edge configs present.
- Mocks toggle: `NEXT_PUBLIC_USE_MOCKS=true`.
- Middleware protects `/account/**` and `/admin/**` via session cookie.
- Backend absent by design — see `Prompt.md` §0.

## User personas
- Retail customer (mock: `customer@bhavita.test / Customer@123`).
- Wholesale / B2B (hotels, resorts, interior designers, corporate gifting).
- Admin (`admin@bhavita.test / Admin@1234`).
- Super Admin (`super@bhavita.test / Super@1234`) — audit + settings only.

## Static requirements
- All data reads/writes go through `src/services/**`.
- All server-computed amounts (cart totals, checkout quote) are echoed from the service — UI never recomputes.
- Every interactive element carries a unique `data-testid`.
- Brand: gold + ivory + navy, serif headings (Cormorant Garamond / Playfair Display), Manrope/DM Sans body.

## What is implemented (2026-01-15)

Placeholder files rewritten in this pass:

- Account: `AccountSidebar`, `OrderCard`, `AddressCard`, `ChangePasswordForm`.
- Product: `WriteReview`.
- Checkout: `ShippingStep`.
- Admin building blocks: `AdminSidebar`, `DataTable`, `KpiCard`, `ImageUploader`, `ReviewModerationRow`, `CouponForm` (UI-only stub), `ProductForm`, `BannerForm`, `OrderStatusUpdater`.
- Admin pages: `admin/layout`, `dashboard`, `products` (list/new/[id]), `categories`, `orders` (list/[id]), `banners`, `reviews`, `customers`, `wholesale-inquiries`, `audit-logs` (super_admin), `settings` (super_admin).
- Marketing pages: `about`, `contact`, `privacy`, `terms`, `return-policy`, `shipping-policy`, `wholesale`.
- Docs: `Prompt.md` fully rewritten; `frontend_workflow.md` phase statuses reconciled; short `Prompt.md`-first pointer added atop `backend_workflow.md`.

Verified: `pnpm lint` clean on all newly written files (0 warnings from new code).

Not run in this pass (per user request): `pnpm dev`, `pnpm build`, supervisor.

## Prioritised backlog

### P0 (safe frontend polish, still mock-only)
- PDP: fullscreen gallery, sticky mobile add-to-cart bar, share buttons, `BreadcrumbList` JSON-LD, `generateMetadata` OG/Twitter cards, canonical URLs.
- Checkout: 3-step stepper (Address → Shipping → Review/Payment); mock Razorpay modal with success/cancel/failure states; invoice PDF blob download on success page.
- Account order detail: cancel + re-order + invoice download buttons; wire Write-review flow from `/account/reviews`.
- SEO/a11y: per-route metadata; WebSite+SearchAction JSON-LD on `/`; Lighthouse ≥ 90; WCAG-AA contrast audit.

### P1
- Central endpoint constants file (`src/services/_endpoints.ts`) so backend swap only edits strings.
- Split `AccountShell` presentation from the new `AccountSidebar`.
- Playwright happy-path scripts.

### Deferred until backend phase opens
- Implement `/app/backend/**` per `backend_workflow.md`.
- Flip `NEXT_PUBLIC_USE_MOCKS=false`, wire real Razorpay + Cloudinary.
- Reconcile the contract deltas documented in `Prompt.md` §5.

## Change log
- **2026-01-15** — Placeholder audit + rewrite (this pass). 37 files added or replaced; docs reconciled.
