# BHAVITA TEXTILES — FRONTEND WORKFLOW (SINGLE SOURCE OF TRUTH)

> **Read me first.** This file is **self-sufficient**. Everything from `BT_Project_plan.md` that is frontend-relevant is inlined here. The companion `backend_workflow.md` defines the API contract; `schema.sql` defines the DB shape. **Do not split logic into more files.**

---

## ⚠️ HARD RULES (NON-NEGOTIABLE — READ BEFORE ANY CODE)

This project is built by a **single developer**, so the frontend is built **end-to-end with mock data first**, and the backend is plugged in later through a stable Service Layer contract. The rules below are not suggestions — they are the contract every phase must obey.

### Rule 1 — Frontend-First Architecture
- Build the **complete** frontend (UI, pages, components, layouts, themes, cart, checkout, account, admin) **before** touching the backend.
- **DO NOT** build any backend APIs during the frontend phase.
- **DO NOT** connect MySQL, Razorpay, Cloudinary, or any real auth during the frontend phase.
- **DO NOT** implement real authentication, payment, file upload, or DB integrations in the initial phases.

### Rule 2 — Layered Data Flow (always, in this exact order)

```
Pages
  ↓
Components
  ↓
Hooks (React Query)
  ↓
Services (services/*.service.ts)
  ↓
[Frontend phase] → Mock Data (mocks/*.mock.ts)
[Backend phase]  → Axios → Backend API → MySQL
```

### Rule 3 — Hard Architectural Bans (the file linter must enforce this)
- ❌ Pages and components MUST NEVER `import` from `mocks/*`.
- ❌ Pages and components MUST NEVER `import` `axios` or call `fetch` directly.
- ❌ Pages and components MUST NEVER hit a URL or endpoint string directly.
- ❌ Hooks and React Query queries MUST only call functions exported from `services/*.service.ts`.
- ✅ Only files inside `services/` are allowed to read from `mocks/` (frontend phase) or call `axios` (backend phase).
- ✅ The same TypeScript interface is shared by: `types/` ↔ `mocks/` ↔ `services/` ↔ future backend API. **One shape, everywhere.**

### Rule 4 — Backend Phase = Service Internals Only
When the backend goes live, **only the internals of `services/*.service.ts` change** — every page, component, layout, theme, form, cart UI, checkout UI, admin UI, and customer UI stays byte-identical.

```
// Frontend phase
export async function getProducts(params) {
  return Promise.resolve(filterMock(mockProducts, params));
}

// Backend phase — same signature, same return type, only the body changes
export async function getProducts(params) {
  const { data } = await api.get('/products', { params });
  return data.data; // matches Product[] interface unchanged
}
```

### Rule 5 — Interface Parity with Backend
- Every TypeScript interface in `types/` MUST mirror the corresponding row in `schema.sql` (snake_case → camelCase mapping documented in `types/_mapping.md`).
- Every mock object MUST satisfy its interface (TypeScript strict mode enforces this at build time).
- The response envelope used by mock services MUST match the real backend envelope (Section 4) exactly.

> **If any of these rules feel inconvenient mid-phase, the answer is to refactor the service, not to break the rule.** Pages and components have a single way to get data: through services. Period.

---

## 0. PROJECT CONTEXT (do not skip)

**Brand:** BHAVITA TEXTILES — premium luxury textile & home-furnishing e-commerce.
**Positioning:** *Handcrafted Home Textiles & Decor for Elegant Living* (alt: *Premium Handloom, Home Furnishing & Handicrafts*).
**This is NOT a college project.** Build it like a real client site that will take real orders, real payments, real customer data. When choosing between "quick" and "production-grade", **always pick production-grade**.

**Target users:** Retail Customers · Wholesale/Bulk Buyers · Interior Designers · Hotels & Resorts · Corporate Buyers · Administrators.

**Bar:** Production Ready · Scalable · Secure · Modular · Maintainable · Well-documented · Mobile-first · SEO-friendly.

---

## 1. TECH STACK (LOCKED)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS + CSS variables |
| UI Kit | ShadCN UI (Radix primitives) |
| Data | React Query (TanStack) + Axios (Axios used by services only) |
| Local UI state | Zustand |
| Animations | Motion (Framer Motion) — restrained, premium |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Toasts | sonner |
| Images | next/image + Cloudinary loader (real loader switched on at backend phase) |
| Payments UI | Razorpay Checkout JS (loaded only on checkout page, real flow switched on at backend phase) |
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
--ink: #F4ECD9 · --ink-2: #A7A294 · --gold: #D4A857 · --gold-2: #F2C97A · --gold-soft: #3A2E16
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
  /account/notifications
/admin (sidebar layout — role-gated)
  /admin/dashboard · /admin/products · /admin/products/new · /admin/products/[id]
  /admin/categories · /admin/orders · /admin/orders/[id]
  /admin/customers · /admin/wholesale-inquiries
  /admin/banners · /admin/reviews
  /admin/audit-logs (super_admin) · /admin/settings
/sitemap.xml · /robots.txt
```

---

## 4. API CONTRACT (SHARED WITH BACKEND — APPLIES TO BOTH MOCK & REAL)

### Response envelope (mock services MUST mimic this verbatim)
```
Success: { "success": true, "data": <payload>, "meta": <pagination/optional> }
Error:   { "success": false, "error": { "code": "STRING_CODE", "message": "human", "fields": {fieldName: "msg"} } }
```
Base URL = `NEXT_PUBLIC_API_URL` (e.g. `https://bhavitatextiles.com/api`). Every backend route is under `/api`.

### Frontend `services/` layer — the ONLY allowed data boundary

Generate a typed function (one per endpoint) inside `services/*.service.ts`. All pages, components, hooks call **only** these service functions.

Required service files (one resource per file):
```
services/product.service.ts
services/category.service.ts
services/cart.service.ts
services/wishlist.service.ts
services/auth.service.ts
services/order.service.ts
services/review.service.ts
services/banner.service.ts
services/user.service.ts          // profile, addresses, change-password
services/wholesale.service.ts

services/notification.service.ts  // in-app notifications (client-derived in frontend phase)
services/admin/*.service.ts       // admin variants for products, orders, customers, banners, reviews, audit, settings, wholesale
services/upload.service.ts        // signed-upload flow (mocked in frontend phase)
services/checkout.service.ts      // quote, razorpay-order, verify (mocked in frontend phase)
services/newsletter.service.ts
services/contact.service.ts
```

Every service file MUST:
- export plain async functions that return strongly-typed promises (`Promise<Product[]>`, `Promise<Cart>`, …).
- internally read from `mocks/` **OR** call the Axios client — never both in the same function on the same code path. Toggle is controlled by `NEXT_PUBLIC_USE_MOCKS` (`true` during frontend phase, `false` at backend integration).
- handle pagination/filtering on the mock side the same way the backend will (so the consumer signature is identical).
- never leak `axios` types, raw HTTP errors, or mock-only fields to callers.

### Token storage rules (CRITICAL — applies the moment auth swaps to real)
- Access JWT: **in-memory only** + injected via Axios interceptor. **Never** `localStorage`.
- Refresh token: server-set `httpOnly` cookie — no client handling.
- On 401 → call `/api/auth/refresh` once → retry original request → on second 401 → logout + redirect to `/auth/login?next=`.
- In frontend phase, the auth service simulates this behaviour against in-memory mock state (a `mockSession` object) so the UI exercises every code path before the real backend lands.

---

## 5. TypeScript ENTITIES — MUST MIRROR `schema.sql`

Create `types/` with one file per entity. Field names + types **must** match `schema.sql` (camelCase TS ↔ snake_case DB, one-to-one). Document the mapping in `types/_mapping.md`.

Required entities (with the schema table they mirror):

| TS interface | Schema table | Notes |
|---|---|---|
| `User` | `users` | strip `password_hash`, `failed_login_count`, `lockout_until` from client-facing shape |
| `Address` | `addresses` | India 6-digit pincode |
| `Category` | `categories` | self-referential `parentId`; children array assembled by service |
| `Product` | `products` | includes `images: ProductImage[]`, `variants: ProductVariant[]`, `aggregateRating`, `reviewCount` |
| `ProductImage` | `product_images` | |
| `ProductVariant` | `product_variants` | size, color, stock, optional price override |
| `Cart` | `carts` + `cart_items` | server-computed totals echoed verbatim by mocks |
| `CartItem` | `cart_items` | snapshot price |
| `Wishlist` / `WishlistItem` | `wishlists` | |
| `Order` | `orders` + `order_items` | full status machine: pending → confirmed → processing → shipped → delivered / cancelled |
| `OrderItem` | `order_items` | immutable name/SKU/price snapshot |
| `Payment` | `payments` | Razorpay ids |
| `Review` | `reviews` | status: pending / approved / rejected |

| `Banner` | `banners` | placement: home_hero / category / promotional |
| `WholesaleInquiry` | `wholesale_inquiries` | businessType enum |
| `NewsletterSubscriber` | `newsletter_subscribers` | |
| `ContactMessage` | `contact_messages` | |
| `AuditLog` | `audit_logs` | admin reads only |
| `SecurityLog` | `security_logs` | super_admin reads only |
| `Notification` | *(client-derived, no table)* | union of order-status events + admin-broadcasts; in frontend phase synthesized from mock orders, swapped to a notifications service later if backend adds one |

Plus shared utility types:
```
types/api.ts        // ApiSuccess<T>, ApiError, PaginationMeta, ListResponse<T>
types/_mapping.md   // snake_case ↔ camelCase mapping reference
```

---

## 6. ENV VARIABLES

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api      # ignored while USE_MOCKS=true
NEXT_PUBLIC_USE_MOCKS=true                          # MASTER TOGGLE — frontend phase only
NEXT_PUBLIC_RAZORPAY_KEY_ID=                        # blank during frontend phase
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=                  # blank during frontend phase
NEXT_PUBLIC_SENTRY_DSN=
```

At backend integration time, set `NEXT_PUBLIC_USE_MOCKS=false` and populate the real keys. **No page, component, or hook references any of these directly — only `lib/env.ts` and `services/` may read `process.env`.**

---

## 7. EXECUTION PROGRESS

> Each phase ≈ **5–6 credits**. Mark a phase `✅ COMPLETED (YYYY-MM-DD)` ONLY after every checkbox is done and verified. Heavy phases were split into A/B sub-phases so every phase stays within budget — **no feature has been removed**.

| #    | Phase                                                          | Credits | Status     |
|------|----------------------------------------------------------------|---------|------------|
| 0    | Foundation Brief & Contract Lock-in                            | 2–3     | ✅ COMPLETED (2026-06-19) |
| 1A   | Project Setup, Luxury Design System & Service-Layer Scaffold   | 5–6     | ✅ COMPLETED (2026-06-19) |
| 1B   | TypeScript Entities, Mock Data Factory & Service Wiring        | 5–6     | ✅ COMPLETED (2026-06-19) |
| 2    | Global Layout, Header, Mega-menu, Footer & Theming             | 5–6     | ✅ COMPLETED  (2025-06-21)
| 3A   | Home — Hero, Featured Categories, New Arrivals, Best Sellers   | 5–6     | ✅ COMPLETED (2026-06-21) |
| 3B   | Home — Seasonal, Handloom Heritage, Testimonials, Brand Story, Wholesale CTA, Newsletter | 5–6 | ⬜ Pending |
| 4    | Shop / Category PLP, Filters, Sort, Pagination, Search, Collections | 5–6 | ⬜ Pending |
| 5A   | PDP — Gallery, Info, Variants, Add to Cart/Wishlist, Tabs      | 5–6     | ⬜ Pending |
| 5B   | PDP — Reviews UI, Write-Review Form, Related, JSON-LD, Share, Breadcrumbs | 5–6 | ⬜ Pending |
| 6    | Authentication Pages & Mock Auth Flow                          | 5–6     | ⬜ Pending |
| 7A   | Cart & Wishlist Pages                                          | 5–6     | ⬜ Pending |
| 7B   | Checkout Multi-step Flow, Mock Razorpay UI, Success & Invoice  | 5–6     | ⬜ Pending |
| 8A   | Account — Layout, Profile, Addresses, Change Password, Notifications | 5–6 | ⬜ Pending |
| 8B   | Account — Orders List/Detail, Cancel, Re-order, Reviews-to-write, Wishlist Page | 5–6 | ⬜ Pending |
| 9A   | Admin — Layout, Dashboard KPIs, Categories, Products CRUD (Mock Upload) | 5–6 | ⬜ Pending |
| 9B   | Admin — Orders, Customers, Wholesale, Banners, Reviews, Audit, Settings | 5–6 | ⬜ Pending |
| 10A  | Static Pages & Public Forms                                    | 5–6     | ⬜ Pending |
| 10B  | SEO, Performance, Accessibility & Polish                       | 5–6     | ⬜ Pending |
| 11   | **Backend Integration Swap (Service Internals Only)**          | 5–6     | ⬜ Pending |

---

## PHASE 0 — Foundation Brief & Contract Lock-in  `(2–3 credits)`
**Status:** ✅ COMPLETED (2026-06-19)

- [ ] Read this file + `schema.sql` + `backend_workflow.md` end-to-end.
- [ ] Confirm the **5 Hard Rules** at the top of this file are understood and will be enforced by the file-linter (see Phase 1A).
- [ ] Lock the API contract — every endpoint in `backend_workflow.md` Phases 2A/2B/4A/4B/5/6A/6B/7A/7B/8A/8B/9 has a corresponding **typed service function**, and every service function has a mock implementation.
- [ ] Lock the TypeScript entities (Section 5) — fields match `schema.sql`. Write `types/_mapping.md`.
- [ ] Confirm response envelope (Section 4) and error code catalog. Mocks must use the exact same envelope.
- [ ] Confirm sitemap (Section 3) is complete.
- [ ] Confirm brand tokens (Section 2) are agreed.

> **Done when:** `types/` and `services/` filenames are listed (empty stubs OK), the rule-enforcement ESLint config is drafted, and a one-page diagram of `Pages → Components → Hooks → Services → (Mocks | API)` is committed to `docs/architecture.md`.

---

## PHASE 1A — Project Setup, Luxury Design System & Service-Layer Scaffold  `(5–6 credits)`
**Status:** ✅ COMPLETED (2026-06-19)

- [ ] Init Next.js 15 + TypeScript (strict) + App Router.
- [ ] Install: `tailwindcss postcss autoprefixer @shadcn/ui @tanstack/react-query axios zustand framer-motion lucide-react zod react-hook-form sonner @sentry/nextjs`.
- [ ] Folder structure (below) — including empty `services/`, `mocks/`, `types/` directories.
- [ ] Tailwind theme: brand color tokens (Section 2) + serif/sans font families.
- [ ] CSS variables for light + dark theme + smooth toggle.
- [ ] `ThemeProvider` reading `localStorage('bt_theme')`; default = system.
- [ ] ShadCN registry installed: `button input label textarea select dialog sheet dropdown-menu tabs sonner popover command separator badge skeleton accordion breadcrumb table`.
- [ ] Axios instance (`lib/api.ts`) with interceptors (attach access token, auto-refresh on 401, single retry). **Used by `services/` only.**
- [ ] `lib/env.ts` — typed env reader; `USE_MOCKS` flag; no other file reads `process.env`.
- [ ] React Query client (staleTime 30 s, retry 1, refetchOnWindowFocus off for product lists).
- [ ] ESLint + Prettier + strict tsconfig.
- [ ] **Architectural lint rules (mandatory, fails CI):**
  ```jsonc
  // .eslintrc — no-restricted-imports for app/ and components/
  // 1. app/** and components/** MUST NOT import from "@/mocks/*"
  // 2. app/** and components/** MUST NOT import "axios" or use "fetch"
  // 3. Only services/** may import from "@/mocks/*" or "@/lib/api"
  // 4. hooks/** may only import from "@/services/*" (not mocks, not axios)
  ```

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
  hooks/       (useProducts, useCart, useAuth, useWishlist, …) — call services only
  services/    (product.service.ts, cart.service.ts, …) — the ONLY data boundary
    admin/     (products.service.ts, orders.service.ts, …)
  mocks/       (products.mock.ts, categories.mock.ts, …) — imported ONLY by services
  types/       (Product.ts, Cart.ts, … + _mapping.md)
  lib/         (api.ts, env.ts, react-query.ts, auth.ts, rbac.ts, seo.ts, format.ts)
  styles/
  middleware.ts   # protects /account, /admin (uses session from mock auth service)
  .eslintrc.cjs   # enforces the import bans
```

> **Done when:** dev server runs, both themes render, ShadCN button uses gold variant, `lib/api.ts` exists but is unused (USE_MOCKS=true), ESLint rejects any page/component that imports from `mocks/` or `axios`.

---

## PHASE 1B — TypeScript Entities, Mock Data Factory & Service Wiring  `(5–6 credits)`
**Status:** ✅ COMPLETED (2026-06-19)

- [x] Create every TS entity from Section 5 with strict typing.
- [x] Generate **production-quality mock data** for each entity in `mocks/`:
  - Categories: full tree from Section 9 (Bedroom / Living Room / Bath / Home Decor / Handloom Heritage / Handicrafts / Special Collections) with all sub-categories.
  - Products: 40+ items spanning every leaf category, with 2–4 images each, 2–3 variants (size/color), realistic INR prices, sale prices on ~30 %, flags (`featured`, `bestSeller`, `newArrival`).
  - Users: 1 customer (`customer@bhavita.test`), 1 admin (`admin@bhavita.test`), 1 super_admin (`super@bhavita.test`) — mock passwords accepted by mock auth service.
  - Cart: empty + a seeded cart for the demo customer.
  - Orders: 6 orders spanning every status (pending / confirmed / processing / shipped / delivered / cancelled).
  - Reviews: ~20 across products (mix of statuses).

  - Banners: 2 home_hero, 1 category, 1 promotional.
  - WholesaleInquiry: 4 (various statuses).
  - Addresses: 2 per user.
  - Wishlist: 5 items for demo customer.
  - Notifications: derived from orders + 2 admin broadcasts.
- [x] Implement **every service function** to return mocks via small helpers (`paginate`, `filterByCategory`, `simulateLatency` 200–400 ms, `simulateErrorRate` toggleable for testing error states).
- [x] Every service function returns the same shape its real backend counterpart will return (envelope unwrapped → typed payload).
- [x] Add `services/__contract__.md` listing every function, its signature, the mock source, and the backend endpoint it will swap to.
- [x] Smoke-test: a throwaway `app/_diag/page.tsx` (dev only, removed before launch) calls every service and prints counts — proves all services wire up before any UI consumes them.

> **Done when:** Every Section-5 entity has an interface, a mock dataset, and a service. Calling any service returns typed data that matches the future API. ESLint still fails any non-service file that touches mocks or axios.

---

## PHASE 2 — Global Layout, Header, Mega-menu, Footer & Theming  `(5–6 credits)`
**Status:** ✅ COMPLETED · **Completed on:** 2025-06-21

- [x] Root layout with `QueryClientProvider` + `ThemeProvider` + `Toaster`.
- [x] Header (sticky): serif wordmark · mega-menu · search · wishlist count · cart count · account · theme toggle · notification bell.
- [x] Mega-menu nav items: **Shop** (nested via `categoryService.getTree()`) · **Wholesale** · **About** · **Contact**. Pin top-level: Bedroom · Living Room · Rugs & Carpets · Door Mats · Bath · Home Decor · Handloom Heritage · Gift Collection · Special Collections · Wholesale.
- [x] Mobile drawer (Sheet) with nested collapsibles.
- [x] Footer: brand snippet + social · shop links · customer service · policies · wholesale CTA · newsletter signup · payment + security badges.
- [x] Breadcrumbs component (also emits JSON-LD `BreadcrumbList`).
- [x] Global search bar — debounced (250 ms) — suggestion dropdown (calls `productService.search`).
- [x] Theme toggle persists across reload.
- [x] Skeletons + error boundary + Sonner toasts.
- [x] Cart/wishlist/notification counts via React Query hooks (`useCart`, `useWishlist`, `useNotifications`) which call services.
> **Done when:** layout works on all routes, mega menu is keyboard-accessible, theme persists, header counters reflect mock data updates live.

---

## PHASE 3A — Home: Hero, Featured Categories, New Arrivals, Best Sellers  `(5–6 credits)`
**Status:** ✅ COMPLETED (2026-01-15) · **Completed on:** 2026-06-21


- [x] Hero Banner section (data from `bannerService.list({ placement: 'home_hero' })`) — full-bleed, cinematic, slide carousel with autoplay + manual controls + reduced-motion respect.
- [x] Featured Categories grid (6–8 cards via `categoryService.getFeatured()`) — serif labels, gold underline hover, lazy-loaded images.
- [x] New Arrivals carousel (`productService.list({ flag: 'new_arrival' })`) — uses shared `ProductCard`.
- [x] Best Sellers section (`productService.list({ flag: 'best_seller' })`) — alternate editorial layout.
- [x] Reusable `ProductCard` component: image with hover swap, name (serif), price + sale price, badges (New / Best Seller / Sale).
- [x] Section-level skeletons + error states (toggle the mock error flag to verify).
- [x] Subtle staggered entrance animations (40–80 ms steps).
- [x] Mobile-first responsive (1 → 2 → 3 → 4 cols).

> **Done when:** four sections render with mock data via services only, animations restrained, no AI-slop gradients, ESLint clean (zero mock/axios imports outside services).

---

## PHASE 3B — Home: Seasonal, Handloom Heritage, Testimonials, Brand Story, Wholesale CTA, Newsletter  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Seasonal Collections block (Summer / Winter / Festive / Wedding) — links to `/collections/<key>`.
- [ ] Handloom Heritage Collection — editorial storytelling layout (asymmetric grid, ivory background, gold dividers).
- [ ] Testimonials carousel via `reviewService.getTestimonials()` with rating stars and customer name.
- [ ] Brand Story — asymmetric editorial layout: heritage tagline, signature craft image, founder quote.
- [ ] Wholesale CTA → `/wholesale` (full-width dark band, gold CTA button, supporting copy for hotels / resorts / designers).
- [ ] Newsletter signup → `newsletterService.subscribe()` (with honeypot, success/error toasts, double opt-in copy).
- [ ] Section spacing tuned for premium whitespace.
- [ ] Reduced-motion respected throughout.

> **Done when:** complete home page (3A + 3B) renders smoothly on mobile + desktop.

---

## PHASE 4 — Shop / Category PLP, Filters, Sort, Pagination, Search & Collections  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Dynamic route `app/(shop)/shop/[[...slug]]/page.tsx` (1+ level nested categories).
- [ ] `ProductCard` (re-used from Phase 3A) — image, name, price, sale price, badges.
- [ ] Product grid responsive (1 / 2 / 3 / 4 cols).
- [ ] `FilterSidebar`: category tree · price range slider · color · size · availability · flag toggles (New / Best Seller / Sale).
- [ ] Sort dropdown: new · price ↑↓ · best sellers · rating.
- [ ] Pagination + infinite scroll fallback (React Query infinite calling `productService.list`).
- [ ] Search results page (`/search?q=`) with same grid + filter behaviour (calls `productService.search`).
- [ ] Empty + skeleton states.
- [ ] Special Collections routes (`/collections/new-arrivals` etc.) → `productService.byCollection(key)`.
- [ ] Filters reflect in URL search params (shareable links).
- [ ] Canonical URL on filtered PLPs = base category.
- [ ] Mobile filter drawer (Sheet) with sticky "Apply" bar.

### Service signature (mock + real share it)
```ts
productService.list(params: {
  category?: string; q?: string; minPrice?: number; maxPrice?: number;
  color?: string; size?: string; sort?: 'new'|'price_asc'|'price_desc'|'best_sellers'|'rating';
  page?: number; limit?: number; flag?: 'new_arrival'|'best_seller'|'featured';
}): Promise<ListResponse<Product>>
```

> **Done when:** filters work via URL, pagination performant on mobile, no layout shift, canonical correctly emitted, mock data correctly filtered/sorted/paginated by the service.

---

## PHASE 5A — PDP: Gallery, Info, Variants, Add to Cart/Wishlist, Tabs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Image gallery: thumbnail strip + hover zoom + mobile swipe + fullscreen modal.
- [ ] Product info block: name (serif), price, sale price (strike-through original), SKU, short description, stock indicator (In Stock / Low Stock / Out of Stock).
- [ ] Variant selectors (size, color) — disable OOS combos; selected variant updates price + stock + image.
- [ ] Quantity stepper (min 1, max stock).
- [ ] Add to Cart button → `cartService.addItem({ productId, variantId, qty })` with toast + cart count update.
- [ ] Add to Wishlist button → `wishlistService.toggle(productId)`.
- [ ] Tabs (ShadCN): Description · Care Instructions · Shipping · Returns.
- [ ] Sticky add-to-cart bar on mobile.

> **Done when:** variants change price/stock/image atomically; add-to-cart works against mock cart and reflects in header count; tabs render content.

---

## PHASE 5B — PDP: Reviews, Write-Review Form, Related Products, JSON-LD, Share, Breadcrumbs  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Reviews list (paginated via `reviewService.listForProduct(productId, { page })`) with rating, customer name, date, review text — only `status='approved'`.
- [ ] Write-review form (login-gated; UI hides for non-buyers — `reviewService.canReview(productId)` returns mock answer in frontend phase).
- [ ] Edit / delete own review.
- [ ] Aggregate rating + count summary at top of reviews tab.
- [ ] Related products carousel (same category, excluding current) via `productService.related(productId)`.
- [ ] Product JSON-LD (Schema.org): `name, image, sku, offers.price, offers.priceCurrency, offers.availability, aggregateRating, brand`.
- [ ] Share buttons (WhatsApp · Copy link · Email).
- [ ] Breadcrumbs with full category chain (also emits `BreadcrumbList` JSON-LD).
- [ ] PDP canonical URL.
- [ ] OG + Twitter cards via `generateMetadata`.

> **Done when:** Product schema passes Rich Results test; review CRUD works against mock store; related carousel populated.

---

## PHASE 6 — Authentication Pages & Mock Auth Flow  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/auth/register` (name, email, phone, password, confirm) — zod schema matches backend (Section 5 of backend workflow).
- [ ] `/auth/login` + remember-me + forgot link + redirect via `?next=` param.
- [ ] `/auth/forgot-password`.
- [ ] `/auth/reset-password?token=`.
- [ ] `/auth/verify-email?token=`.
- [ ] `useAuth` hook + React Query for `authService.me()`.
- [ ] `authService` implements the full lifecycle in mocks: register/login/logout/refresh/me/changePassword/forgotPassword/resetPassword/verifyEmail/resendVerification — all backed by an in-memory mockSession with the same token-rotation semantics so that swapping to real APIs is a no-op for the UI.
- [ ] Axios interceptor wired (unused while USE_MOCKS=true) so that the moment the toggle flips, refresh-on-401 works.
- [ ] `middleware.ts` protects `/account` and `/admin` (reads role from a cookie set by mock auth service).
- [ ] Logout flow clears in-memory token + invalidates queries.
- [ ] Password strength meter + show/hide toggle.
- [ ] Resend verification CTA after register.

### Mock credentials (also written to `docs/mock-credentials.md`)
| Role | Email | Password |
|---|---|---|
| Customer | `customer@bhavita.test` | `Customer@123` |
| Admin | `admin@bhavita.test` | `Admin@1234` |
| Super Admin | `super@bhavita.test` | `Super@1234` |

> **Done when:** full auth lifecycle works E2E against mocks; protected routes redirect to login with `next` param; verify-email + reset-password links work; the UI never branches on USE_MOCKS — only the service does.

---

## PHASE 7A — Cart & Wishlist Pages  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Cart page: line items (image, name, variant, qty stepper, line subtotal, remove) · subtotal · shipping · tax · total — **all amounts come from `cartService.get()`** (the mock service computes them server-side-style; UI never recomputes).
- [ ] Empty cart state with CTA to /shop.
- [ ] Wishlist page: grid view · move to cart · remove · empty state (calls `wishlistService.*`).
- [ ] Inline error messages for stock issues, out-of-stock, etc. — driven by mock error codes that match the real backend's codes (Section 4).
- [ ] "Proceed to Checkout" CTA disabled when cart empty or any line OOS.
- [ ] Mobile-friendly sticky cart total bar.

> **Done when:** cart totals come from the service (never recomputed in UI); wishlist CRUD works.

---

## PHASE 7B — Checkout Multi-step Flow, Mock Razorpay UI, Success & Invoice Download  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Checkout step 1: select existing address / add new address (inline form via `userService.addresses.*`).
- [ ] Checkout step 2: review — re-fetch totals via `checkoutService.quote()`; show order summary + delivery address.
- [ ] Checkout step 3: payment — `checkoutService.createRazorpayOrder()` → opens **mock Razorpay modal** (real Razorpay script lazy-loaded only here; in frontend phase a faithful mock modal mimics the success / failure / cancel flows).
- [ ] On success → `checkoutService.verifyPayment()` with `Idempotency-Key` → redirect `/checkout/success?orderId=`.
- [ ] On payment failure / cancel → friendly error state with retry option.
- [ ] Order confirmation page (`/checkout/success`) with order number, summary, estimated delivery, next-steps copy (data from `orderService.byNumber()`).
- [ ] Invoice download button (`orderService.downloadInvoice(orderNumber)` — returns a generated PDF blob in mock mode, real backend PDF later).
- [ ] Loading guards (disable Pay until quote returns).
- [ ] Stepper UI with back navigation (data preserved in Zustand).

### Razorpay UI rules (apply the moment the toggle flips)
- Use `NEXT_PUBLIC_RAZORPAY_KEY_ID` only — **never** the secret.
- `amount` and `currency` come from the **service response**, never from the cart UI.
- Lazy-load `checkout.razorpay.com/v1/checkout.js` only on this page (already gated behind USE_MOCKS check inside `checkoutService`).

> **Done when:** end-to-end checkout works against the mock Razorpay flow; orders appear in `/account/orders`; invoice downloads.

---

## PHASE 8A — Account: Layout, Profile, Addresses, Change Password, Notifications  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/account` layout with sidebar: Profile · Addresses · Orders · Wishlist · Reviews · Notifications · Logout.
- [ ] `/account/profile`: edit name + phone via `userService.updateProfile`; show verified-email status + resend verification.
- [ ] Change password form (current + new + confirm) with strength meter — `authService.changePassword`.
- [ ] `/account/addresses`: list · add new · edit · delete · set default (single-default invariant enforced inside the address service).
- [ ] Address form with pincode validation (India 6-digit).
- [ ] `/account/notifications`: list via `notificationService.list()`, mark-read, mark-all-read.
- [ ] Empty states + skeletons.
- [ ] Mobile-friendly screens (sidebar collapses to top tabs).

> **Done when:** all profile + address + notification CRUD works against mock store; ownership enforced inside the service (a customer cannot read another user's addresses); change-password forces re-login.

---

## PHASE 8B — Account: Orders List/Detail, Cancel, Re-order, Reviews-to-write, Wishlist Page  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/account/orders`: order history list via `orderService.listMine()` with status badges + search/filter.
- [ ] `/account/orders/[orderNumber]`: detail with timeline (Pending → Confirmed → Processing → Shipped → Delivered → Cancelled), line items, payment info, address, totals.
- [ ] Cancel order button (visible only when status ∈ {pending, confirmed}) → `orderService.cancel(orderNumber)`.
- [ ] Re-order button → `cartService.bulkAdd(items)` respecting current mock stock.
- [ ] Download invoice button.
- [ ] `/account/reviews` — "Reviews to write" tab listing delivered orders not yet reviewed (`reviewService.toWrite()`) + "My reviews" tab with edit/delete.
- [ ] `/account/wishlist` page (reuses Phase 7A wishlist if needed).
- [ ] Mobile-friendly screens.

> **Done when:** all account actions hit secured services; UI never shows another user's data; cancel and re-order work end-to-end against mocks.

---

## PHASE 9A — Admin: Layout, Dashboard KPIs, Categories, Products CRUD (Mock Upload)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Admin layout sidebar: Dashboard · Products · Categories · Orders · Customers · Wholesale Inquiries · Banners · Reviews · Audit Log (super_admin) · Settings.
- [ ] `/admin/dashboard`: KPIs (Total Sales · Total Orders · Total Customers · Total Products) + revenue chart (Recharts) + recent orders table + top-selling products — data from `adminService.dashboard()`.
- [ ] `/admin/categories`: tree CRUD + image upload (nested categories supported).
- [ ] `/admin/products`: data table (search/sort/filter/paginate) + bulk soft-delete.
- [ ] `/admin/products/new` and `/admin/products/[id]`: full multi-step form — info → images → variants → publish toggle → stock adjust.
- [ ] **Mock Cloudinary upload flow** in `uploadService`:
  1. `uploadService.getSignature(folder)` returns a mock signature object — same shape as the real Cloudinary signed-upload response.
  2. `uploadService.upload(file)` → in mock mode reads the file as a data URL or stages a local blob URL; in real mode uploads to Cloudinary.
  3. `uploadService.persist({ secureUrl, publicId, alt, sortOrder })` → in mock mode appends to the in-memory product images; in real mode calls the backend.
- [ ] Validate file types (jpg/jpeg/png/webp/avif) + size (≤5 MB) on the client too.
- [ ] All admin pages **gated by `role` from `useAuth` (UX)** AND **service-level guard (mocked RBAC)**, ready to be swapped for backend RBAC.

> **Done when:** dashboard charts render mock data; product CRUD with variants + images works end-to-end against mocks; non-admin role gets 403 from the service layer on direct URL hits.

---

## PHASE 9B — Admin: Orders, Customers, Wholesale, Banners, Reviews, Audit Log, Settings  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/admin/orders`: table + detail + status update + refund button — `adminService.orders.*`.
- [ ] `/admin/customers`: list + detail with order history + lifetime value.
- [ ] `/admin/wholesale-inquiries`: table + status update + CSV export (mock CSV generated client-side from the service result).
- [ ] `/admin/banners`: CRUD (placement, schedule, image upload via mock uploadService, link, sort order).
- [ ] `/admin/reviews`: moderation queue (approve / reject).
- [ ] `/admin/audit-logs` (super_admin only): paginated filterable viewer (actor, entity, action, date).
- [ ] `/admin/settings` (super_admin): admin/user role management, site-level toggles.
- [ ] Confirm dialogs on destructive actions; all writes use optimistic updates with rollback on error.

> **Done when:** every admin CRUD works against mocks; super-admin-only pages reject regular admin; CSV export downloads; refund completes in mock mode.

---

## PHASE 10A — Static Pages & Public Forms  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/about` — Brand story, heritage, craft, team (long-form layout).
- [ ] `/contact` — Form → `contactService.submit()` with honeypot, success toast, contact info, optional map embed.
- [ ] `/privacy` — Privacy Policy.
- [ ] `/terms` — Terms and Conditions.
- [ ] `/return-policy` — Return Policy.
- [ ] `/shipping-policy` — Shipping Policy.
- [ ] `/wholesale` — Wholesale info + Wholesale Inquiry Form → `wholesaleService.submit()` (fields: companyName, contactPerson, email, phone, businessType, productInterest, quantityRequirement, message).
- [ ] Footer correctly links all 7 pages.
- [ ] Forms use react-hook-form + zod with field-level error mapping from `error.fields` envelope.

> **Done when:** every static page is live, linked in footer, and renders gracefully on mobile; both forms submit successfully via services and show structured errors from the mock response.

---

## PHASE 10B — SEO, Performance, Accessibility & Polish  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### SEO
- [ ] `generateMetadata()` per route (product, category, home, static, collection).
- [ ] JSON-LD: `Organization` · `WebSite + SearchAction` (home) · `BreadcrumbList` · `Product` + `AggregateRating` (PDP).
- [ ] `app/sitemap.ts` — dynamic, includes products + categories + collections + static pages (uses `productService.allSlugs()` etc.).
- [ ] `app/robots.ts` — disallow `/admin`, `/account`, `/cart`, `/checkout`, `/api`.
- [ ] Canonical URLs on dynamic routes; filtered PLP canonical = base category.

### Performance (target Lighthouse mobile ≥ 90)
- [ ] `next/image` everywhere with Cloudinary loader (mock blob URLs accepted by the loader during frontend phase); AVIF/WebP auto; blur placeholders.
- [ ] Lazy-load offscreen images + non-critical components (Razorpay script, admin charts, heavy modals).
- [ ] Code splitting + dynamic imports.
- [ ] Caching: React Query staleTime tuned per resource; CDN-ready assets.
- [ ] CWV targets: LCP < 2.5 s · CLS < 0.1 · INP < 200 ms.
- [ ] Font preloading + `font-display: swap`.

### Accessibility & Polish
- [ ] Focus rings · ARIA labels · `alt` text · skip-link · ≥ 44 × 44 px taps.
- [ ] Reduced-motion respected.
- [ ] WCAG AA contrast across both themes.
- [ ] Sentry on frontend with release tags + user context (id only).
- [ ] 404 + 500 pages branded.
- [ ] Final polish pass on motion + spacing + typography.

> **Done when:** Lighthouse mobile ≥ 90; structured data passes validators; all static pages live and linked; Sentry receives a forced error.

---

## PHASE 11 — Backend Integration Swap (Service Internals Only)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

This phase begins **only after** all of Phases 0 → 10B are ✅ Completed and the frontend has been approved on mock data.

### Inputs from backend team
- Live `NEXT_PUBLIC_API_URL`.
- Razorpay public key id, Cloudinary cloud name, Sentry DSN.
- A signed-off backend OpenAPI/contract doc confirming every endpoint matches `services/__contract__.md` field-for-field.

### Swap procedure
- [ ] Set `NEXT_PUBLIC_USE_MOCKS=false` and populate the new env values.
- [ ] For each service file in `services/`, replace the `mocks/*` branch with real Axios calls. **Do not touch** the function signature, return type, or any caller.
- [ ] Verify the Axios interceptors (already wired in Phase 1A): bearer-token attach, refresh-on-401, single-retry, logout-on-2nd-401.
- [ ] Verify the Razorpay block: real script loads only on `/checkout`; `amount + currency` come from `checkoutService.quote()` server response.
- [ ] Verify Cloudinary signed upload flow against the real `/api/admin/upload/signature`.
- [ ] Run the existing E2E tests written against services — every test should still pass without UI changes.
- [ ] Remove `mocks/` (or keep behind a dev-only `__mocks__` flag for storybook / Playwright fixtures).
- [ ] Delete `app/_diag/page.tsx` (Phase 1B smoke-test page).
- [ ] Sentry receives a real error in production.

### Hard guarantee (success criterion)
After this phase, a `git diff` between "approved mock build" and "backend-integrated build" should touch **only**:
- `services/**`
- `lib/api.ts`
- `lib/env.ts`
- `.env`
- (optionally) `next.config.js` for Cloudinary loader hosts

**Zero changes** to: `app/**`, `components/**`, `hooks/**`, `types/**`, `styles/**`, `middleware.ts`. If any other file is modified during this phase, the swap is wrong — fix the service abstraction instead.

> **Done when:** the UI behaves identically to the mock build, all flows pass against the live backend, the diff is confined to the files listed above.

---

## 8. NON-FUNCTIONAL REQUIREMENTS (must hold across all phases)

- Mobile First.
- SEO Optimized.
- Fast Loading (Core Web Vitals).
- Responsive Design (320 px → 1920 px).
- Accessibility AA.
- Image Optimization (`next/image`, AVIF/WebP, blur placeholders, responsive `sizes`).
- Secure Authentication once real backend is wired (in-memory access JWT, httpOnly refresh cookie).
- **No client-side price/total/stock computation — always come from `cartService` / `checkoutService` / `productService` response**, whether mock or real.
- Production Ready Code (typed, modular, reusable components).

---

## 9. CATALOG REFERENCE (for mega-menu + UI copy + mock seed)

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

### Implementing LLM — Hard Rules (recap)
- **Pages and components NEVER import mock data or call APIs directly.** Data flows exclusively through `services/`.
- Every service function has the same signature in mock mode and real mode — only the body changes at Phase 11.
- The TypeScript interface in `types/` is the single source of truth shared by mock, service, hook, page, and (later) backend response.
- Never trust the client for price / total / stock — render values returned from the service (which echoes the backend contract).
- Never store the access token in localStorage. Refresh token is a server-set httpOnly cookie (real phase).
- Every admin page must be RBAC-protected at both the middleware (UX) and the service (mock-now / backend-later) layers.
- Mirror `schema.sql` field names in `types/` exactly (camelCase ↔ snake_case mapping in `types/_mapping.md`).
- Match the brand bar: serif headings, restrained motion, premium spacing — no AI-slop gradients or default ShadCN looks.
- One component < 50 lines where reasonable; reuse via composition.
