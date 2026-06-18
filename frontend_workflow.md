# BHAVITA TEXTILES — FRONTEND WORKFLOW (SINGLE SOURCE OF TRUTH)

> **Read me first.** This file is **self-sufficient**. Everything from `BT_Project_plan.md` that is frontend-relevant is inlined here. The companion `backend_workflow.md` defines the API contract; `schema.sql` defines the DB shape. **Do not split logic into more files.**

---

## 0. PROJECT CONTEXT (do not skip)

**Brand:** BHAVITA TEXTILES — premium luxury textile & home-furnishing e-commerce.
**Positioning:** *Handcrafted Home Textiles & Decor for Elegant Living* (alt: *Premium Handloom, Home Furnishing & Handicrafts*).
**This is NOT a college project.** Build it like a real client site that will take real orders, real payments, real customer data. When choosing between \"quick\" and \"production-grade\", **always pick production-grade**.

**Target users:** Retail Customers · Wholesale/Bulk Buyers · Interior Designers · Hotels & Resorts · Corporate Buyers · Administrators.

**Bar:** Production Ready · Scalable · Secure · Modular · Maintainable · Well-documented · Mobile-first · SEO-friendly.

---

## 1. TECH STACK (LOCKED)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS + CSS variables |
| UI Kit | ShadCN UI (Radix primitives) |
| Data | React Query (TanStack) + Axios |
| Local UI state | Zustand |
| Animations | Motion (Framer Motion) — restrained, premium |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Toasts | sonner |
| Images | next/image + Cloudinary loader |
| Payments UI | Razorpay Checkout JS (loaded only on checkout page) |
| Monitoring | Sentry (`@sentry/nextjs`) |

---

## 2. LUXURY BRAND EXPERIENCE (DESIGN BAR)

The site must **feel** like a premium luxury brand — not a generic store.

**Avoid:** generic e-commerce template look · cheap bootstrap aesthetic · crowded layouts · excessive animations · purple/violet AI-slop gradients · overused fonts (Inter, Roboto, Arial, system).

**Focus on:** Premium Typography · Elegant Layouts · Luxury Visual Hierarchy · High-End Product Presentation · Immersive Product Pages · Whitespace · Subtle micro-motion.

**Inspiration:** Luxury Textile Brands · Luxury Home Décor Brands · Luxury Furniture Brands.

### Brand Tokens — Light Theme
```
--bg: #FBF8F2    (Ivory)
--surface: #FFFFFF
--surface-2: #F3EEE3
--ink: #1B1F2A
--ink-2: #4A5161
--gold: #B8893A    (Royal Gold — primary)
--gold-2: #8C661F  (hover)
--gold-soft: #E9D7AE
--navy: #0E1A33    (headings accent)
--border: #E5DDC9
--success: #3F7D58
--danger: #9A2A2A
```

### Brand Tokens — Dark Theme (Luxury Black + Gold)
```
--bg: #0B0C0F · --surface: #15171C · --surface-2: #1D2027
--ink: #F4ECD9 · --ink-2: #A7A294
--gold: #D4A857 · --gold-2: #F2C97A · --gold-soft: #3A2E16
--border: #2A2D34
```

### Typography
- **Headings (serif):** Cormorant Garamond *or* Playfair Display (700 / 600)
- **Body (sans):** Manrope *or* DM Sans (400 / 500 / 600)
- **Avoid:** Inter · Roboto · Arial · system fonts.

### Theme Switching
- User-controlled, persisted in `localStorage` (key `bt_theme`).
- Default = system preference; switching is instant + smooth (≤200 ms).
- Theme survives reload + navigation.

### Animation Rules
- Subtle · premium · professional.
- Page-load: staggered entrance (40–80 ms steps) on key sections.
- Hover micro-motion on cards, buttons, images.
- `transition: <specific property>` — never `transition: all` on transformable elements.
- No bouncy springs on critical UI (checkout, forms).

### Accessibility (a11y)
- Focus rings visible on all interactive elements.
- ARIA labels on icon-only buttons.
- `alt` on every image.
- Skip-link to main content.
- Touch targets ≥ 44 × 44 px.
- Color contrast WCAG AA minimum.

---

## 3. ROUTE MAP / SITEMAP

```
/                                          Home
/shop                                      Shop landing
/shop/[...slug]                            Category / sub-category pages
/product/[slug]                            Product Detail
/search?q=                                 Search results
/collections/{new-arrivals|best-sellers|summer|winter|festive|wedding}
/wholesale                                 Wholesale info + inquiry form
/about · /contact · /privacy · /terms · /return-policy · /shipping-policy
/auth/register · /auth/login · /auth/forgot-password
/auth/reset-password?token= · /auth/verify-email?token=
/cart
/checkout (multi-step) · /checkout/success?orderId=
/account (sidebar layout)
  /account/profile · /account/addresses · /account/orders
  /account/orders/[orderNumber] · /account/wishlist · /account/reviews
/admin (sidebar layout — role-gated)
  /admin/dashboard · /admin/products · /admin/products/new · /admin/products/[id]
  /admin/categories · /admin/orders · /admin/orders/[id]
  /admin/customers · /admin/wholesale-inquiries
  /admin/coupons · /admin/banners · /admin/reviews
  /admin/audit-logs (super_admin) · /admin/settings
/sitemap.xml · /robots.txt
```

---

## 4. API CONTRACT (SHARED WITH BACKEND)

### Response envelope
```
Success: { \"success\": true, \"data\": <payload>, \"meta\": <pagination/optional> }
Error:   { \"success\": false, \"error\": { \"code\": \"STRING_CODE\", \"message\": \"human\", \"fields\": {fieldName: \"msg\"} } }
```
Base URL = `NEXT_PUBLIC_API_URL` (e.g. `https://bhavitatextiles.com/api`). Every backend route is under `/api`.

### Frontend `services/` layer
Generate a typed Axios client for every endpoint listed in `backend_workflow.md` (Phases 2A/2B, 4A/4B, 5, 6A/6B, 7A/7B, 8A/8B, 9). One file per resource: `services/auth.ts`, `services/products.ts`, `services/cart.ts`, `services/orders.ts`, `services/admin/*.ts`, etc.

### Token storage rules (CRITICAL)
- Access JWT: **in-memory only** + injected via Axios interceptor. **Never** `localStorage`.
- Refresh token: server-set `httpOnly` cookie — no client handling.
- On 401 → call `/api/auth/refresh` once → retry original request → on second 401 → logout + redirect to `/auth/login?next=`.

---

## 5. TypeScript TYPES — MUST MIRROR `schema.sql`

Create `types/` with: `User`, `Address`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `Cart`, `CartItem`, `Wishlist`, `Order`, `OrderItem`, `Payment`, `Review`, `Coupon`, `Banner`, `WholesaleInquiry`. Field names + types **must** match `schema.sql`.

---

## 6. ENV VARIABLES

```
NEXT_PUBLIC_APP_URL=https://bhavitatextiles.com
NEXT_PUBLIC_API_URL=https://bhavitatextiles.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=        # public key id only — NEVER the secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 7. EXECUTION PROGRESS

> Each phase ≈ **5–6 credits**. Mark a phase `✅ COMPLETED (YYYY-MM-DD)` ONLY after every checkbox is done and verified. Heavy phases were split into A/B sub-phases so every phase stays within budget — **no feature has been removed**.

| #    | Phase                                                          | Credits | Status     |
|------|----------------------------------------------------------------|---------|------------|
| 0    | Foundation Brief & Contract Lock-in                            | 2–3     | ⬜ Pending |
| 1    | Project Setup & Luxury Design System                           | 5–6     | ⬜ Pending |
| 2    | Global Layout, Header, Mega-menu, Footer & Theming             | 5–6     | ⬜ Pending |
| 3A   | Home — Hero, Featured Categories, New Arrivals, Best Sellers   | 5–6     | ⬜ Pending |
| 3B   | Home — Seasonal, Handloom Heritage, Testimonials, Brand Story, Wholesale CTA, Newsletter | 5–6 | ⬜ Pending |
| 4    | Shop / Category PLP, Filters, Sort, Pagination, Search, Collections | 5–6 | ⬜ Pending |
| 5A   | PDP — Gallery, Info, Variants, Add to Cart/Wishlist, Tabs      | 5–6     | ⬜ Pending |
| 5B   | PDP — Reviews UI, Write-Review Form, Related, JSON-LD, Share, Breadcrumbs | 5–6 | ⬜ Pending |
| 6    | Authentication Pages & Auth Flow                               | 5–6     | ⬜ Pending |
| 7A   | Cart, Wishlist Pages & Coupon UI                               | 5–6     | ⬜ Pending |
| 7B   | Checkout Multi-step Flow, Razorpay UI, Success & Invoice DL    | 5–6     | ⬜ Pending |
| 8A   | Account — Layout, Profile, Addresses, Change Password          | 5–6     | ⬜ Pending |
| 8B   | Account — Orders List/Detail, Cancel, Re-order, Reviews-to-write, Wishlist Page | 5–6 | ⬜ Pending |
| 9A   | Admin — Layout, Dashboard KPIs, Categories, Products CRUD (Cloudinary) | 5–6 | ⬜ Pending |
| 9B   | Admin — Orders, Customers, Wholesale, Coupons, Banners, Reviews, Audit Log, Settings | 5–6 | ⬜ Pending |
| 10A  | Static Pages (About/Contact/Wholesale/Policies) + Public Forms | 5–6     | ⬜ Pending |
| 10B  | SEO (metadata/JSON-LD/sitemap/robots), Performance, Accessibility & Polish | 5–6 | ⬜ Pending |

---

## PHASE 0 — Foundation Brief & Contract Lock-in  `(2–3 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Read this file + `schema.sql` + `backend_workflow.md` end-to-end.
- [ ] Lock the API contract — every endpoint in `backend_workflow.md` Phases 2A/2B/4A/4B/5/6A/6B/7A/7B/8A/8B/9 has a typed client in `services/`.
- [ ] Lock the TypeScript types (Section 5) — fields match `schema.sql`.
- [ ] Confirm response envelope (Section 4) and error code catalog.
- [ ] Confirm sitemap (Section 3) is complete.
- [ ] Confirm brand tokens (Section 2) are agreed.

> **Done when:** `types/` mirrors schema, `services/` stubs every backend endpoint.

---

## PHASE 1 — Project Setup & Luxury Design System  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Init Next.js 15 + TypeScript (strict) + App Router.
- [ ] Install: `tailwindcss postcss autoprefixer @shadcn/ui @tanstack/react-query axios zustand framer-motion lucide-react zod react-hook-form sonner @sentry/nextjs`.
- [ ] Folder structure (below).
- [ ] Tailwind theme: brand color tokens (Section 2) + serif/sans font families.
- [ ] CSS variables for light + dark theme + smooth toggle.
- [ ] `ThemeProvider` reading `localStorage('bt_theme')`; default = system.
- [ ] ShadCN registry installed: `button input label textarea select dialog sheet dropdown-menu tabs sonner popover command separator badge skeleton accordion breadcrumb`.
- [ ] Axios instance with interceptors (attach access token, auto-refresh on 401, single retry).
- [ ] React Query client (staleTime 30 s, retry 1, refetchOnWindowFocus off for product lists).
- [ ] ESLint + Prettier + strict tsconfig.

### Folder structure
```
frontend/
  app/
    (marketing)/ (about, contact, privacy, terms, return-policy, shipping-policy, wholesale)
    (shop)/      (shop/[[...slug]], product/[slug], collections/[key], search)
    (auth)/      (register, login, forgot-password, reset-password, verify-email)
    (account)/account/...
    (admin)/admin/...
    cart/page.tsx
    checkout/page.tsx · checkout/success/page.tsx
    sitemap.ts · robots.ts · layout.tsx · page.tsx (home)
  components/ (ui, layout, product, home, shop, cart, checkout, account, admin, common)
  lib/ (axios, react-query, auth, rbac, seo, format, env)
  hooks/ · services/ · types/ · styles/
  middleware.ts   # protects /account, /admin
```

> **Done when:** dev server runs, both themes render, ShadCN button uses gold variant, Axios + React Query hit `/api/health` successfully.

---

## PHASE 2 — Global Layout, Header, Mega-menu, Footer & Theming  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Root layout with `QueryClientProvider` + `ThemeProvider` + `Toaster`.
- [ ] Header (sticky): serif wordmark · mega-menu · search · wishlist count · cart count · account · theme toggle.
- [ ] Mega-menu nav items: **Shop** (nested via `GET /api/categories`) · **Wholesale** · **About** · **Contact**. Pin top-level: Bedroom · Living Room · Rugs & Carpets · Door Mats · Bath · Home Decor · Handloom Heritage · Gift Collection · Special Collections · Wholesale.
- [ ] Mobile drawer (Sheet) with nested collapsibles.
- [ ] Footer: brand snippet + social · shop links · customer service · policies · wholesale CTA · newsletter signup · payment + security badges.
- [ ] Breadcrumbs component (also emits JSON-LD `BreadcrumbList`).
- [ ] Global search bar — debounced (250 ms) — suggestion dropdown.
- [ ] Theme toggle persists across reload.
- [ ] Skeletons + error boundary + Sonner toasts.
- [ ] Cart/wishlist counts via React Query (`useCart`, `useWishlist`).

> **Done when:** layout works on all routes, mega menu is keyboard-accessible, theme persists.

---

## PHASE 3A — Home: Hero, Featured Categories, New Arrivals, Best Sellers  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Hero Banner section (data from `GET /api/banners?placement=home_hero`) — full-bleed, cinematic, slide carousel with autoplay + manual controls + reduced-motion respect.
- [ ] Featured Categories grid (6–8 cards) — serif labels, gold underline hover, lazy-loaded images.
- [ ] New Arrivals carousel (`GET /api/products?flag=new_arrival`) — uses shared `ProductCard`.
- [ ] Best Sellers section (`flag=best_seller`) — alternate editorial layout.
- [ ] Reusable `ProductCard` component: image with hover swap, name (serif), price + sale price, badges (New / Best Seller / Sale).
- [ ] Section-level skeletons + error states.
- [ ] Subtle staggered entrance animations (40–80 ms steps).
- [ ] Mobile-first responsive (1 → 2 → 3 → 4 cols).

> **Done when:** four sections render with live data, animations restrained, no AI-slop gradients.

---

## PHASE 3B — Home: Seasonal, Handloom Heritage, Testimonials, Brand Story, Wholesale CTA, Newsletter  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Seasonal Collections block (Summer / Winter / Festive / Wedding) — links to `/collections/<key>`.
- [ ] Handloom Heritage Collection — editorial storytelling layout (asymmetric grid, ivory background, gold dividers).
- [ ] Testimonials carousel (static seed or admin-managed) with rating stars and customer name.
- [ ] Brand Story — asymmetric editorial layout: heritage tagline, signature craft image, founder quote.
- [ ] Wholesale CTA → `/wholesale` (full-width dark band, gold CTA button, supporting copy for hotels / resorts / designers).
- [ ] Newsletter signup → `POST /api/newsletter/subscribe` (with honeypot, success/error toasts, double opt-in copy).
- [ ] Section spacing tuned for premium whitespace.
- [ ] Reduced-motion respected throughout.

> **Done when:** complete home page (3A + 3B) renders smoothly on mobile + desktop, Lighthouse score holds.

---

## PHASE 4 — Shop / Category PLP, Filters, Sort, Pagination, Search & Collections  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Dynamic route `app/(shop)/shop/[[...slug]]/page.tsx` (1+ level nested categories).
- [ ] `ProductCard` (re-used from Phase 3A) — image, name, price, sale price, badges.
- [ ] Product grid responsive (1 / 2 / 3 / 4 cols).
- [ ] `FilterSidebar`: category tree · price range slider · color · size · availability · flag toggles (New / Best Seller / Sale).
- [ ] Sort dropdown: new · price ↑↓ · best sellers · rating.
- [ ] Pagination + infinite scroll fallback (React Query infinite).
- [ ] Search results page (`/search?q=`) with same grid + filter behaviour.
- [ ] Empty + skeleton states.
- [ ] Special Collections routes (`/collections/new-arrivals` etc.).
- [ ] Filters reflect in URL search params (shareable links).
- [ ] Canonical URL on filtered PLPs = base category.
- [ ] Mobile filter drawer (Sheet) with sticky \"Apply\" bar.

### API call
```
GET /api/products?category=<slug>&q=&min_price=&max_price=&color=&size=&sort=&page=&limit=&flag=
```

> **Done when:** filters work via URL, pagination performant on mobile, no layout shift, canonical correctly emitted.

---

## PHASE 5A — PDP: Gallery, Info, Variants, Add to Cart/Wishlist, Tabs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Image gallery: thumbnail strip + hover zoom + mobile swipe + fullscreen modal.
- [ ] Product info block: name (serif), price, sale price (strike-through original), SKU, short description, stock indicator (In Stock / Low Stock / Out of Stock).
- [ ] Variant selectors (size, color) — disable OOS combos; selected variant updates price + stock + image.
- [ ] Quantity stepper (min 1, max stock).
- [ ] Add to Cart button → `POST /api/cart/items` with toast + cart count update.
- [ ] Add to Wishlist button → `POST /api/wishlist` (toggle state).
- [ ] Tabs (ShadCN): Description · Care Instructions · Shipping · Returns.
- [ ] Sticky add-to-cart bar on mobile.

### APIs
`GET /api/products/:slug` · `POST /api/cart/items` · `POST /api/wishlist`.

> **Done when:** variants change price/stock/image atomically; add-to-cart works and reflects in header count; tabs render content.

---

## PHASE 5B — PDP: Reviews, Write-Review Form, Related Products, JSON-LD, Share, Breadcrumbs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Reviews list (paginated) with rating, customer name, date, review text — only `status='approved'`.
- [ ] Write-review form (login-gated + verified-purchaser-only — backend enforces; UI hides for non-buyers).
- [ ] Edit / delete own review.
- [ ] Aggregate rating + count summary at top of reviews tab.
- [ ] Related products carousel (same category, excluding current).
- [ ] Product JSON-LD (Schema.org): `name, image, sku, offers.price, offers.priceCurrency, offers.availability, aggregateRating, brand`.
- [ ] Share buttons (WhatsApp · Copy link · Email).
- [ ] Breadcrumbs with full category chain (also emits `BreadcrumbList` JSON-LD).
- [ ] PDP canonical URL.
- [ ] OG + Twitter cards via `generateMetadata`.

### APIs
`GET /api/products/:id/reviews` · `POST /api/products/:id/reviews` · `PATCH /api/reviews/:id` · `DELETE /api/reviews/:id`.

> **Done when:** Product schema passes Rich Results test; review CRUD works; related carousel populated.

---

## PHASE 6 — Authentication Pages & Auth Flow  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/auth/register` (name, email, phone, password, confirm) — zod schema matches backend.
- [ ] `/auth/login` + remember-me + forgot link + redirect via `?next=` param.
- [ ] `/auth/forgot-password`.
- [ ] `/auth/reset-password?token=`.
- [ ] `/auth/verify-email?token=`.
- [ ] `useAuth` hook + React Query for `/api/auth/me`.
- [ ] Axios interceptor: attach access token; on 401 → `/auth/refresh` once → retry; on 2nd fail → logout.
- [ ] `middleware.ts` protects `/account` and `/admin` (server-side check via cookie + role).
- [ ] Logout flow clears in-memory token + invalidates queries.
- [ ] Password strength meter + show/hide toggle.
- [ ] Resend verification CTA after register.

### Token storage (CRITICAL — see Section 4)
- Access token: in-memory + Axios header. **Do NOT** store in localStorage.
- Refresh token: server-set httpOnly cookie.

> **Done when:** full auth lifecycle works E2E with backend; protected routes redirect to login with `next` param; verify-email + reset-password links work.

---

## PHASE 7A — Cart, Wishlist Pages & Coupon UI  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Cart page: line items (image, name, variant, qty stepper, line subtotal, remove) · subtotal · shipping · tax · discount · total — **all amounts from `GET /api/cart`** (never compute on client).
- [ ] Empty cart state with CTA to /shop.
- [ ] Wishlist page: grid view · move to cart · remove · empty state.
- [ ] CouponBox component: apply / remove → refreshes cart query; shows applied coupon badge + savings.
- [ ] Inline error messages for stock issues, invalid coupon, expired coupon, etc.
- [ ] \"Proceed to Checkout\" CTA disabled when cart empty or any line OOS.
- [ ] Mobile-friendly sticky cart total bar.

### APIs
`GET /api/cart` · `POST /api/cart/items` · `PATCH /api/cart/items/:id` · `DELETE /api/cart/items/:id` · `POST /api/cart/coupon` · `DELETE /api/cart/coupon` · `GET/POST/DELETE /api/wishlist`.

> **Done when:** cart totals match backend; coupon flows tested (valid / expired / under-min / used-up); wishlist CRUD works.

---

## PHASE 7B — Checkout Multi-step Flow, Razorpay UI, Success & Invoice Download  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Checkout step 1: select existing address / add new address (inline form).
- [ ] Checkout step 2: review — re-fetch totals via `POST /api/checkout/quote`; show order summary + delivery address.
- [ ] Checkout step 3: payment — `POST /api/checkout/razorpay/order` → open Razorpay Checkout (script lazy-loaded only here).
- [ ] On success → `POST /api/checkout/razorpay/verify` with `Idempotency-Key` → redirect `/checkout/success?orderId=`.
- [ ] On payment failure / cancel → friendly error state with retry option.
- [ ] Order confirmation page (`/checkout/success`) with order number, summary, estimated delivery, next-steps copy.
- [ ] Invoice download button (`GET /api/orders/:orderNumber/invoice`).
- [ ] Loading guards (disable Pay until quote returns).
- [ ] Stepper UI with back navigation (data preserved).

### Razorpay UI rules
- Use `NEXT_PUBLIC_RAZORPAY_KEY_ID` only — **never** the secret.
- `amount` and `currency` come from the **backend** verify-order response, never from the cart UI.
- Lazy-load `checkout.razorpay.com/v1/checkout.js` only on this page.

> **Done when:** end-to-end checkout works in Razorpay test mode; orders appear in `/account/orders`; invoice downloads.

---

## PHASE 8A — Account: Layout, Profile, Addresses, Change Password  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/account` layout with sidebar: Profile · Addresses · Orders · Wishlist · Reviews · Logout.
- [ ] `/account/profile`: edit name + phone; show verified-email status + resend verification.
- [ ] Change password form (current + new + confirm) with strength meter.
- [ ] `/account/addresses`: list · add new · edit · delete · set default (single-default invariant).
- [ ] Address form with pincode validation (India 6-digit).
- [ ] Empty states + skeletons.
- [ ] Mobile-friendly screens (sidebar collapses to top tabs).

> **Done when:** all profile + address CRUD works; ownership enforced server-side; change-password forces re-login.

---

## PHASE 8B — Account: Orders List/Detail, Cancel, Re-order, Reviews-to-write, Wishlist Page  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/account/orders`: order history list with status badges + search/filter.
- [ ] `/account/orders/[orderNumber]`: detail with timeline (Pending → Confirmed → Processing → Shipped → Delivered → Cancelled), line items, payment info, address, totals.
- [ ] Cancel order button (visible only when status ∈ {pending, confirmed}) → `POST /api/orders/:orderNumber/cancel`.
- [ ] Re-order button (adds same items to cart, respecting current stock).
- [ ] Download invoice button (`GET /api/orders/:orderNumber/invoice`).
- [ ] `/account/reviews` — \"Reviews to write\" tab listing delivered orders not yet reviewed + \"My reviews\" tab with edit/delete.
- [ ] `/account/wishlist` page (reuses Phase 7A wishlist if needed).
- [ ] Mobile-friendly screens.

> **Done when:** all account actions hit secured APIs; UI never shows another user's data; cancel and re-order work end-to-end.

---

## PHASE 9A — Admin: Layout, Dashboard KPIs, Categories, Products CRUD (Cloudinary)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Admin layout sidebar: Dashboard · Products · Categories · Orders · Customers · Wholesale Inquiries · Coupons · Banners · Reviews · Audit Log (super_admin) · Settings.
- [ ] `/admin/dashboard`: KPIs (Total Sales · Total Orders · Total Customers · Total Products) + revenue chart (Recharts or similar) + recent orders table + top-selling products.
- [ ] `/admin/categories`: tree CRUD + image upload (nested categories supported).
- [ ] `/admin/products`: data table (search/sort/filter/paginate) + bulk soft-delete.
- [ ] `/admin/products/new` and `/admin/products/[id]`: full multi-step form — info → images (Cloudinary signed upload) → variants → publish toggle → stock adjust.
- [ ] Cloudinary upload flow:
  1. `POST /api/admin/upload/signature` → returns `{signature, timestamp, api_key, folder, cloud_name}`.
  2. Upload directly to Cloudinary.
  3. `POST` returned `{secure_url, public_id}` to persist via backend.
- [ ] Validate file types (jpg/jpeg/png/webp/avif) + size (≤5 MB) on the client too.
- [ ] All admin pages **gated by `role` from `useAuth` (UX)** AND **backend RBAC (security)**.

> **Done when:** dashboard charts render real data; product CRUD with variants + images works end-to-end; non-admins get 403 on direct URL hits.

---

## PHASE 9B — Admin: Orders, Customers, Wholesale, Coupons, Banners, Reviews, Audit Log, Settings  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/admin/orders`: table + detail + status update (`Pending · Confirmed · Processing · Shipped · Delivered · Cancelled`) + refund button (Razorpay refund).
- [ ] `/admin/customers`: list + detail with order history + lifetime value.
- [ ] `/admin/wholesale-inquiries`: table + status update + CSV export.
- [ ] `/admin/coupons`: CRUD (discount type, value, min cart, usage limit, per-user limit, start/end dates).
- [ ] `/admin/banners`: CRUD (placement, schedule, image upload via Cloudinary, link, sort order).
- [ ] `/admin/reviews`: moderation queue (approve / reject).
- [ ] `/admin/audit-logs` (super_admin only): paginated filterable viewer (actor, entity, action, date).
- [ ] `/admin/settings` (super_admin): admin/user role management, site-level toggles.
- [ ] Confirm dialogs on destructive actions; all writes use optimistic updates with rollback on error.

> **Done when:** every admin CRUD works; super-admin-only pages reject regular admin; CSV export downloads; refund completes in test mode.

---

## PHASE 10A — Static Pages & Public Forms  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

Static Pages (linked from footer) — premium editorial layouts, serif headings, generous whitespace:
- [ ] `/about` — Brand story, heritage, craft, team (long-form layout).
- [ ] `/contact` — Form → `POST /api/contact` with honeypot, success toast, contact info (address, phone, email, hours), map embed (optional).
- [ ] `/privacy` — Privacy Policy.
- [ ] `/terms` — Terms and Conditions.
- [ ] `/return-policy` — Return Policy.
- [ ] `/shipping-policy` — Shipping Policy.
- [ ] `/wholesale` — Wholesale info (audiences: Hotels · Resorts · Hospitals · Hostels · Retail · Designers · Corporate Gifting) + Wholesale Inquiry Form (fields: company_name, contact_person, email, phone, business_type, product_interest, quantity_requirement, message) → `POST /api/wholesale-inquiry`.
- [ ] Footer correctly links all 7 pages.
- [ ] Forms use react-hook-form + zod with field-level error mapping from backend `error.fields`.

> **Done when:** every static page is live, linked in footer, and renders gracefully on mobile; both forms submit successfully and show backend-validated errors.

---

## PHASE 10B — SEO, Performance, Accessibility & Polish  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### SEO (frontend)
- [ ] `generateMetadata()` per route — title, description, OG, Twitter cards (product, category, home, static, collection).
- [ ] JSON-LD: `Organization` (root layout) · `WebSite + SearchAction` (home) · `BreadcrumbList` (everywhere) · `Product` + `AggregateRating` (PDP).
- [ ] `app/sitemap.ts` — dynamic, includes products + categories + collections + static pages (or delegate to backend; pick one).
- [ ] `app/robots.ts` — disallow `/admin`, `/account`, `/cart`, `/checkout`, `/api`.
- [ ] Canonical URLs on dynamic routes; filtered PLP canonical = base category.

### Performance (target Lighthouse mobile ≥ 90)
- [ ] `next/image` everywhere with Cloudinary loader; AVIF/WebP auto; blur placeholders; responsive `sizes`.
- [ ] Lazy-load offscreen images + non-critical components (Razorpay script, admin charts, heavy modals).
- [ ] Code splitting + dynamic imports.
- [ ] Caching strategy: React Query staleTime tuned per resource; CDN-ready assets.
- [ ] Core Web Vitals targets: LCP < 2.5 s · CLS < 0.1 · INP < 200 ms.
- [ ] Font preloading + `font-display: swap`.

### Accessibility & Polish
- [ ] Focus rings · ARIA labels · `alt` text · skip-link · ≥ 44 × 44 px taps.
- [ ] Reduced-motion respected (`prefers-reduced-motion`).
- [ ] WCAG AA contrast verified across both themes.
- [ ] Sentry on frontend (`@sentry/nextjs`) with release tags + user context (id only).
- [ ] 404 + 500 pages branded.
- [ ] Final polish pass on motion + spacing + typography.

> **Done when:** Lighthouse mobile ≥ 90 (Perf, SEO, A11y, Best Practices); structured data passes validators; all static pages live and linked; Sentry receives a forced error.

---

## 8. NON-FUNCTIONAL REQUIREMENTS (must hold across all phases)

- Mobile First.
- SEO Optimized (Section above).
- Fast Loading (Core Web Vitals).
- Responsive Design (320 px → 1920 px).
- Accessibility AA.
- Image Optimization (`next/image`, AVIF/WebP, blur placeholders, responsive `sizes`).
- Secure Authentication (Section 6).
- No client-side price/total/stock computation — always server.
- Production Ready Code (typed, modular, reusable components).

---

## 9. CATALOG REFERENCE (for mega-menu + UI copy)

**Home sections:** Hero Banner · Featured Categories · New Arrivals · Best Sellers · Seasonal Collections · Handloom Heritage Collection · Testimonials · Brand Story · Wholesale CTA · Newsletter Subscription.

**Bedroom Collection** — Bedsheets (Cotton · Handloom · Printed · Premium · King · Queen · Kids) · Blankets & Comforters (Cotton · Winter · AC · Quilts · Dohars) · Pillows & Bedding Accessories (Pillow Covers · Cushion Covers · Bed Runners).

**Living Room Collection** — Soft Furnishings (Sofa Throws · Sofa Covers · Cushion Covers) · Curtains (Sheer · Blackout · Cotton · Printed · Luxury) · Rugs & Carpets (Handwoven · Cotton · Floor · Area · Carpets · Runner) · Door Mats (Cotton · Anti-Slip · Decorative · Outdoor).

**Bath Collection** — Towels (Bath · Hand · Face · Luxury · Hotel) · Bath Mats.

**Home Decor** — Wall Decor · Table Linen · Decorative Textiles · Handmade Decor · Festive Decor · Cushion Styling Collection.

**Handloom Heritage** — Jaipur Prints · Block Print · Artisan · Ethnic Weaves · Traditional Handloom.

**Handicrafts** — Handmade Home Accessories · Decorative Items · Traditional Craft · Gift Collection.

**Special Collections** — New Arrivals · Best Sellers · Summer · Winter · Festive · Wedding.

**Bulk / Wholesale audience** — Hotels · Resorts · Hospitals · Hostels · Retail Stores · Interior Designers · Corporate Gifting.

---

### Completion Legend
⬜ Pending · 🟡 In Progress · ✅ Completed (YYYY-MM-DD)

### Implementing LLM — Hard Rules
- Never trust the client for price / total / stock — always render values returned from backend.
- Never store the access token in localStorage. Refresh token is a server-set httpOnly cookie.
- Every admin page must be RBAC-protected at both the middleware (UX) and the backend (security) layers.
- Mirror `schema.sql` field names in `types/` exactly.
- Match the brand bar: serif headings, restrained motion, premium spacing — no AI-slop gradients or default ShadCN looks.
- One component < 50 lines where reasonable; reuse via composition.
