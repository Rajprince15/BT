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
Generate a typed Axios client for every endpoint listed in `backend_workflow.md` (Phases 2, 4, 5, 6, 7, 8, 9). One file per resource: `services/auth.ts`, `services/products.ts`, `services/cart.ts`, `services/orders.ts`, `services/admin/*.ts`, etc.

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

> Mark a phase `✅ COMPLETED (YYYY-MM-DD)` ONLY after every checkbox is done and verified. Each phase ≈ **5–6 credits**.

| #  | Phase                                            | Credits | Status     |
|----|--------------------------------------------------|---------|------------|
| 0  | Foundation Brief & Contract Lock-in              | 2–3     | ⬜ Pending |
| 1  | Project Setup & Luxury Design System             | 5–6     | ⬜ Pending |
| 2  | Global Layout, Header, Footer & Theming          | 5–6     | ⬜ Pending |
| 3  | Home Page (All Sections)                         | 5–6     | ⬜ Pending |
| 4  | Shop / Category & Product Listing Pages          | 5–6     | ⬜ Pending |
| 5  | Product Detail Page                              | 5–6     | ⬜ Pending |
| 6  | Authentication Pages & Auth Flow                 | 5–6     | ⬜ Pending |
| 7  | Cart, Wishlist & Checkout (Razorpay UI)          | 5–6     | ⬜ Pending |
| 8  | Customer Profile, Addresses & Orders             | 5–6     | ⬜ Pending |
| 9  | Admin Dashboard UI (full panel)                  | 5–6     | ⬜ Pending |
| 10 | Static Pages, SEO, Animations & Polish           | 5–6     | ⬜ Pending |

---

## PHASE 0 — Foundation Brief & Contract Lock-in  `(2–3 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Read this file + `schema.sql` + `backend_workflow.md` end-to-end.
- [ ] Lock the API contract — every endpoint in `backend_workflow.md` Phases 2/4/6/7/8/9 has a typed client in `services/`.
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

## PHASE 2 — Global Layout, Header, Footer & Theming  `(5–6 credits)`
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

## PHASE 3 — Home Page (All Sections)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Hero Banner (data from `GET /api/banners?placement=home_hero`).
- [ ] Featured Categories grid (6–8 cards).
- [ ] New Arrivals carousel (`GET /api/products?flag=new_arrival`).
- [ ] Best Sellers (`flag=best_seller`).
- [ ] Seasonal Collections block.
- [ ] Handloom Heritage Collection — editorial storytelling layout.
- [ ] Testimonials carousel.
- [ ] Brand Story (asymmetric editorial layout).
- [ ] Wholesale CTA → `/wholesale`.
- [ ] Newsletter signup → `POST /api/newsletter/subscribe`.
- [ ] Subtle staggered entrance animations (40–80 ms steps).

> **Done when:** every section is responsive, data via React Query, motion restrained (no AI-slop).

---

## PHASE 4 — Shop / Category & Product Listing  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Dynamic route `app/(shop)/shop/[[...slug]]/page.tsx`.
- [ ] `ProductCard`: image, name, price, sale price, badges (New / Best Seller / Sale).
- [ ] Product grid responsive (1 / 2 / 3 / 4 cols).
- [ ] `FilterSidebar`: category tree · price range · color · size · availability.
- [ ] Sort dropdown: new · price ↑↓ · best sellers · rating.
- [ ] Pagination / infinite scroll (React Query infinite).
- [ ] Search results page (`/search?q=`).
- [ ] Empty + skeleton states.
- [ ] Special Collections routes (`/collections/new-arrivals` etc.).
- [ ] Filters reflect in URL search params (shareable links).
- [ ] Canonical URL on filtered PLPs = base category.

### API call
```
GET /api/products?category=<slug>&q=&min_price=&max_price=&color=&size=&sort=&page=&limit=&flag=
```

> **Done when:** filters work via URL, pagination performant on mobile, no layout shift.

---

## PHASE 5 — Product Detail Page  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Image gallery: thumbnail strip + hover zoom + mobile swipe.
- [ ] Product info block: name, price, sale price, SKU, short desc, stock indicator.
- [ ] Variant selectors (size, color) — disable OOS combos.
- [ ] Quantity stepper · Add to Cart · Add to Wishlist.
- [ ] Tabs: Description · Care · Shipping · Returns.
- [ ] Reviews + ratings list (paginated) + write-review form (login-gated, verified-purchaser-only).
- [ ] Related products carousel.
- [ ] Product JSON-LD: `name, image, sku, offers.price, offers.priceCurrency, offers.availability, aggregateRating`.
- [ ] Share buttons (WhatsApp · Copy link).
- [ ] Breadcrumbs with full category chain.

### APIs
`GET /api/products/:slug` · `GET /api/products/:id/reviews` · `POST /api/cart/items` · `POST /api/wishlist`.

> **Done when:** variants change price/stock; add-to-cart works; Product schema passes Rich Results test.

---

## PHASE 6 — Authentication Pages & Auth Flow  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/auth/register` (name, email, phone, password) — zod schema matches backend.
- [ ] `/auth/login` + remember-me + forgot link.
- [ ] `/auth/forgot-password`.
- [ ] `/auth/reset-password?token=`.
- [ ] `/auth/verify-email?token=`.
- [ ] `useAuth` hook + React Query for `/api/auth/me`.
- [ ] Axios interceptor: attach access token; on 401 → `/auth/refresh` once → retry; on 2nd fail → logout.
- [ ] `middleware.ts` protects `/account` and `/admin` (server-side check via cookie + role).
- [ ] Logout flow clears in-memory token + invalidates queries.
- [ ] Password strength meter + show/hide toggle.

### Token storage (CRITICAL — see Section 4)
- Access token: in-memory + Axios header. **Do NOT** store in localStorage.
- Refresh token: server-set httpOnly cookie.

> **Done when:** full auth lifecycle works E2E with backend; protected routes redirect to login with `next` param.

---

## PHASE 7 — Cart, Wishlist & Checkout (Razorpay UI)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Cart page: line items · qty update · remove · subtotal · shipping · tax · discount · total — **all amounts from `GET /api/cart`** (never compute on client).
- [ ] Wishlist page: grid view · move to cart · remove.
- [ ] CouponBox: `POST /api/cart/coupon` → refresh cart query.
- [ ] Checkout step 1: select / add address.
- [ ] Checkout step 2: review (re-fetch totals via `POST /api/checkout/quote`).
- [ ] Checkout step 3: Razorpay Checkout (script lazy-loaded only here).
- [ ] On success → `POST /api/checkout/razorpay/verify` → redirect `/checkout/success?orderId=`.
- [ ] Order confirmation page with order number + summary.
- [ ] Invoice download (`GET /api/orders/:orderNumber/invoice`).
- [ ] Empty states + loading guards (disable Pay until quote returns).

### Razorpay UI rules
- Use `NEXT_PUBLIC_RAZORPAY_KEY_ID` only — never the secret.
- `amount` and `currency` come from the **backend** verify-order response, never from the cart UI.

> **Done when:** end-to-end checkout works in Razorpay test mode; orders appear in `/account/orders`.

---

## PHASE 8 — Customer Profile, Addresses & Orders  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Account layout with sidebar: Profile · Addresses · Orders · Wishlist · Reviews · Logout.
- [ ] Edit profile (name, phone) + change password.
- [ ] Address book CRUD + set default.
- [ ] Order history list with status badges.
- [ ] Order detail with timeline (Pending → Confirmed → Processing → Shipped → Delivered).
- [ ] Cancel order (if status allows) → `POST /api/orders/:orderNumber/cancel`.
- [ ] Re-order button (adds same items to cart).
- [ ] \"Reviews to write\" tab — list of delivered orders not yet reviewed.
- [ ] Download invoice.
- [ ] Mobile-friendly screens.

> **Done when:** all account actions hit secured APIs; UI never shows another user's data.

---

## PHASE 9 — Admin Dashboard UI (full panel)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Admin layout sidebar: Dashboard · Products · Categories · Orders · Customers · Wholesale Inquiries · Coupons · Banners · Reviews · Audit Log (super_admin) · Settings.
- [ ] Dashboard KPIs (Total Sales · Total Orders · Total Customers · Total Products) + revenue chart + recent orders table.
- [ ] Categories tree CRUD + image upload (nested categories supported).
- [ ] Products data table + add/edit form (info, images via signed Cloudinary upload, variants, stock).
- [ ] Orders table + detail + status update (`Pending · Confirmed · Processing · Shipped · Delivered · Cancelled`).
- [ ] Customers list + detail with order history.
- [ ] Wholesale inquiries table + CSV export.
- [ ] Coupons CRUD (discount type, value, min cart, usage limit, per-user limit, expiry).
- [ ] Banners CRUD (placement, schedule, image, link).
- [ ] Reviews moderation (approve / reject).
- [ ] Audit log viewer (super_admin only).
- [ ] All admin pages **gated by `role` from `useAuth` (UX)** AND **backend RBAC (security)**. Never rely on UI checks alone.

### Cloudinary upload flow (admin)
1. `POST /api/admin/upload/signature` → returns `{signature, timestamp, api_key, folder, cloud_name}`.
2. Upload directly to Cloudinary with those params.
3. `POST` returned `{secure_url, public_id}` to the relevant backend endpoint to persist.

> **Done when:** CRUD works for every entity; non-admins get 403 on direct URL hits; charts render real backend data.

---

## PHASE 10 — Static Pages, SEO, Animations & Polish  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Static Pages (linked from footer)
- [ ] About Us
- [ ] Contact Us  (form → `POST /api/contact`)
- [ ] Privacy Policy
- [ ] Terms and Conditions
- [ ] Return Policy
- [ ] Shipping Policy
- [ ] Wholesale Inquiry page (form → `POST /api/wholesale-inquiry`)

### SEO (frontend)
- [ ] `generateMetadata()` per route — title, description, OG, Twitter cards.
- [ ] JSON-LD: `Organization` (root) · `WebSite + SearchAction` (home) · `BreadcrumbList` (everywhere) · `Product` + `AggregateRating` (PDP).
- [ ] `app/sitemap.ts` — dynamic, includes products + categories + collections + static pages.
- [ ] `app/robots.ts` — disallow `/admin`, `/account`, `/cart`, `/checkout`, `/api`.
- [ ] Canonical URLs on dynamic routes; filtered PLP canonical = base category.

### Performance (target Lighthouse mobile ≥ 90)
- [ ] `next/image` everywhere with Cloudinary loader; AVIF/WebP auto; blur placeholders.
- [ ] Lazy-load offscreen images + non-critical components.
- [ ] Code splitting + dynamic imports for Razorpay Checkout, admin charts, heavy modals.
- [ ] Caching strategy: React Query staleTime tuned per resource; CDN-ready assets.
- [ ] Core Web Vitals optimized (LCP < 2.5 s · CLS < 0.1 · INP < 200 ms).

### Accessibility & Polish
- [ ] Focus rings · ARIA labels · `alt` text · skip-link · ≥ 44 × 44 px taps.
- [ ] Reduced-motion respected (`prefers-reduced-motion`).
- [ ] Sentry on frontend (`@sentry/nextjs`) with release tags.

> **Done when:** Lighthouse mobile ≥ 90 (Perf, SEO, A11y, Best Practices); structured data passes validators; all static pages live and linked in footer.

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
