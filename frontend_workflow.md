"# BHAVITA TEXTILES — FRONTEND WORKFLOW

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · ShadCN UI · React Query · Axios · Zustand (UI state) · Motion (Framer)
**Brand:** Royal Gold · Ivory · Deep Navy · Luxury Black + Gold (dark) · Serif headings + Sans body

> **How to use:** Mark a phase `✅ COMPLETED (YYYY-MM-DD)` ONLY after every checkbox is done and verified. Each phase = **5–6 credits**. Always read `BT_project_plan.md` + `schema.sql` + `backend_workflow.md` before coding so APIs and DB fields line up.

---

## Progress Overview

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

- [ ] Read `BT_project_plan.md`, `schema.sql`, and `backend_workflow.md` end-to-end
- [ ] Lock the **API contract** (every endpoint from BACKEND_WORKFLOW PHASE 4 + 6 + 7 + 8 must have a typed client in `services/`)
- [ ] Lock the **TypeScript types** for: User, Address, Category, Product, ProductImage, ProductVariant, Cart, CartItem, Wishlist, Order, OrderItem, Payment, Review, Coupon, Banner, WholesaleInquiry — fields MUST match `schema.sql`
- [ ] Confirm response envelope: `{ success, data, meta }` and error: `{ success:false, error:{code,message,fields} }`
- [ ] Confirm route map (sitemap in this file) is complete
- [ ] Confirm brand tokens (below) match design intent

> **Done when:** `types/` matches schema, `services/` has stubs for every backend endpoint listed in BACKEND_WORKFLOW.

---

## PHASE 1 — Project Setup & Luxury Design System  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

### Tasks
- [ ] Initialize Next.js 15 + TypeScript (strict) + App Router
- [ ] Install Tailwind, PostCSS, Autoprefixer, ShadCN UI, React Query, Axios, Zustand, Motion, Lucide-react, zod, react-hook-form, sonner
- [ ] Folder structure (see below)
- [ ] Tailwind theme: brand color tokens + serif/sans font families
- [ ] CSS variables for light + dark theme
- [ ] ThemeProvider (localStorage key `bt_theme`, default = system)
- [ ] ShadCN registry installed: button, input, label, textarea, select, dialog, sheet, dropdown-menu, tabs, toast/sonner, popover, command, separator, badge, skeleton, accordion, breadcrumb
- [ ] Axios instance with interceptors (attach access token, auto-refresh on 401)
- [ ] QueryClient with sensible defaults (staleTime 30s, retry 1)
- [ ] ESLint + Prettier + strict tsconfig

### Brand Tokens (use exactly these — light theme)
```
--bg: #FBF8F2   (Ivory)
--surface: #FFFFFF
--surface-2: #F3EEE3
--ink: #1B1F2A
--ink-2: #4A5161
--gold: #B8893A  (Royal Gold — primary)
--gold-2: #8C661F (hover)
--gold-soft: #E9D7AE
--navy: #0E1A33  (headings)
--border: #E5DDC9
--success: #3F7D58 · --danger: #9A2A2A
```
### Dark theme
```
--bg:#0B0C0F · --surface:#15171C · --surface-2:#1D2027
--ink:#F4ECD9 · --ink-2:#A7A294
--gold:#D4A857 · --gold-2:#F2C97A · --gold-soft:#3A2E16
--border:#2A2D34
```
### Typography
- Headings (serif): **Cormorant Garamond** or **Playfair Display** (700/600)
- Body (sans): **Manrope** or **DM Sans** (400/500/600)
- Avoid: Inter, Roboto, Arial

### Folder Structure
```
frontend/
  app/ (marketing, shop, auth, account, admin, cart, checkout, sitemap.ts, robots.ts, layout.tsx)
  components/ (ui, layout, product, home, shop, cart, checkout, account, admin, common)
  lib/ (axios, react-query, auth, rbac, seo, format, env)
  hooks/ · services/ · types/ · styles/
  middleware.ts (protects /account, /admin)
```

> **Done when:** dev server runs, both themes render, ShadCN button uses gold variant, axios+react-query work against backend `/api/health`.

---

## PHASE 2 — Global Layout, Header, Footer & Theming  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Root layout with QueryClientProvider + ThemeProvider + Toaster
- [ ] Header: logo (serif wordmark), mega-menu, search, wishlist count, cart count, account, theme toggle
- [ ] Mega menu nav items: Shop (nested), Wholesale, About, Contact
- [ ] Mobile drawer (Sheet) with nested collapsibles
- [ ] Footer: brand snippet + social, shop links, customer service, policies, wholesale CTA, newsletter, payment + security badges
- [ ] Breadcrumbs component (also emits JSON-LD)
- [ ] Global search bar with debounce + suggestions UI
- [ ] Theme toggle persists, smooth ≤ 200ms transition
- [ ] Skeletons + error boundary + Sonner toasts
- [ ] Cart/wishlist counts via React Query (`useCart`, `useWishlist`)

### Mega-menu source of truth
Use category tree from `GET /api/categories`. Pin top-level: Bedroom · Living Room · Rugs & Carpets · Door Mats · Bath · Home Decor · Handloom Heritage · Gift Collection · Special Collections · Wholesale.

> **Done when:** layout works on all routes, mega menu is keyboard-accessible, theme persists across reload.

---

## PHASE 3 — Home Page (All Sections)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Hero Banner (data from `GET /api/banners?placement=home_hero`)
- [ ] Featured Categories grid (6–8 cards)
- [ ] New Arrivals carousel (`GET /api/products?flag=new_arrival`)
- [ ] Best Sellers (`flag=best_seller`)
- [ ] Seasonal Collections block
- [ ] Handloom Heritage Collection storytelling
- [ ] Testimonials carousel
- [ ] Brand Story (editorial layout)
- [ ] Wholesale CTA (links to `/wholesale`)
- [ ] Newsletter signup (`POST /api/newsletter/subscribe`)
- [ ] Subtle staggered entrance animations (40–80ms steps)

> **Done when:** every section is responsive, data fetched via React Query, motion is restrained (no AI-slop).

---

## PHASE 4 — Shop / Category & Product Listing Pages  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Dynamic route `app/(shop)/shop/[[...slug]]/page.tsx`
- [ ] ProductCard (image, name, price, sale price, badges)
- [ ] Product grid responsive (1/2/3/4 cols)
- [ ] FilterSidebar: category tree, price range, color, size, availability
- [ ] Sort dropdown: new, price ↑↓, best sellers, rating
- [ ] Pagination / infinite scroll (React Query infinite)
- [ ] Search results page (`/search?q=`)
- [ ] Empty + skeleton states
- [ ] Special Collections routes: new-arrivals, best-sellers, summer, winter, festive, wedding
- [ ] Filters update URL search params (shareable)

### API calls
`GET /api/products?category=<slug>&q=&min_price=&max_price=&color=&size=&sort=&page=&limit=&flag=`

> **Done when:** filters work via URL params, pagination performant on mobile, no layout shift.

---

## PHASE 5 — Product Detail Page  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Image gallery with thumbnail strip + hover zoom
- [ ] Product info (name, price, sale, SKU, short desc, stock indicator)
- [ ] Variant selectors (size, color) — disable OOS combos
- [ ] Quantity stepper + Add to Cart + Add to Wishlist
- [ ] Tabs: Description, Care, Shipping, Returns
- [ ] Reviews & ratings list + write-review form (login-gated)
- [ ] Related products carousel
- [ ] Product JSON-LD (name, image, sku, offers.price, aggregateRating)
- [ ] Share buttons (WhatsApp, Copy link)
- [ ] Breadcrumbs with full category chain

### API calls
`GET /api/products/:slug` · `GET /api/products/:id/reviews` · `POST /api/cart/items` · `POST /api/wishlist`

> **Done when:** variants change price/stock, add-to-cart works, Product schema validates in Rich Results test.

---

## PHASE 6 — Authentication Pages & Auth Flow  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] `/auth/register` (name, email, phone, password) with zod
- [ ] `/auth/login` + remember-me + forgot link
- [ ] `/auth/forgot-password`
- [ ] `/auth/reset-password?token=`
- [ ] `/auth/verify-email?token=`
- [ ] Auth context / hook (`useAuth`) + React Query for `/auth/me`
- [ ] Axios interceptor: attach access token; on 401 call `/auth/refresh` once then retry; on second fail, logout
- [ ] `middleware.ts` protects `/account` and `/admin` routes
- [ ] Logout flow clears tokens + invalidates queries
- [ ] Password strength meter + show/hide toggle

### Token storage
- Access token: in-memory + axios header. **Do NOT** store in localStorage.
- Refresh token: server-set httpOnly cookie (no client handling required).

> **Done when:** full auth lifecycle works E2E with backend, protected routes redirect to login with `next` param.

---

## PHASE 7 — Cart, Wishlist & Checkout (Razorpay UI)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Cart page: line items, qty update, remove, subtotal, shipping, tax, discount, total — **all amounts from `GET /api/cart`** (never compute on client)
- [ ] Wishlist page: grid view, move to cart, remove
- [ ] CouponBox: `POST /api/cart/coupon` then refresh cart
- [ ] Checkout step 1: select / add address
- [ ] Checkout step 2: review (re-fetch totals via `POST /api/checkout/quote`)
- [ ] Checkout step 3: Razorpay Checkout (script loaded only here)
- [ ] Verify on success: `POST /api/checkout/razorpay/verify` → redirect `/checkout/success?orderId=`
- [ ] Order confirmation page with order number + summary
- [ ] Invoice download (`GET /api/orders/:orderNumber/invoice`)
- [ ] Empty states + loading guards (disable Pay button until quote returns)

### Razorpay UI rules
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` only — never the secret
- Amount/currency comes from backend response, never from cart UI

> **Done when:** end-to-end checkout works in Razorpay test mode and orders appear in `/account/orders`.

---

## PHASE 8 — Customer Profile, Addresses & Orders  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Account layout with sidebar (Profile, Addresses, Orders, Wishlist, Logout)
- [ ] Edit profile (name, phone) + change password
- [ ] Address book CRUD + set default
- [ ] Order history list with status badges
- [ ] Order detail w/ timeline (Pending → Confirmed → Processing → Shipped → Delivered)
- [ ] Cancel order (if status allows) → `POST /api/orders/:orderNumber/cancel`
- [ ] Re-order button (adds same items to cart)
- [ ] \"Reviews to write\" tab pulled from delivered orders
- [ ] Download invoice
- [ ] Mobile-friendly screens

> **Done when:** all account actions hit secured APIs and never show other users' data.

---

## PHASE 9 — Admin Dashboard UI (full panel)  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Admin layout with sidebar: Dashboard, Products, Categories, Orders, Customers, Wholesale Inquiries, Coupons, Banners, Reviews, Audit Log (super_admin), Settings
- [ ] Dashboard KPIs (sales, orders, customers, products) + revenue chart + recent orders table
- [ ] Categories tree CRUD + image upload
- [ ] Products data table + add/edit form (info, images via Cloudinary signed upload, variants, stock)
- [ ] Orders table + detail + status update
- [ ] Customers list + detail with order history
- [ ] Wholesale inquiries table + CSV export
- [ ] Coupons CRUD (discount type, value, min cart, expiry)
- [ ] Banners CRUD (placement, schedule, image)
- [ ] Reviews moderation (approve / reject)
- [ ] All admin pages gated by `role` from `useAuth` (UX) and protected by backend RBAC

### Cloudinary upload
1. Request `POST /api/admin/upload/signature`
2. Upload directly to Cloudinary with returned params
3. POST returned `secure_url` + `public_id` to backend

> **Done when:** CRUD works for all entities, non-admins get 403 on direct URL hits, charts render real backend data.

---

## PHASE 10 — Static Pages, SEO, Animations & Polish  `(5–6 credits)`
**Status:** ⬜ Pending · **Completed on:** —

- [ ] Static pages: About, Contact, Privacy, T&C, Return Policy, Shipping Policy
- [ ] Contact form + Wholesale inquiry form (`POST /api/contact`, `POST /api/wholesale-inquiry`)
- [ ] `generateMetadata()` per route — title, description, OG, Twitter cards
- [ ] JSON-LD: Organization (root), WebSite+SearchAction (home), BreadcrumbList, Product, AggregateRating
- [ ] `app/sitemap.ts` (dynamic, includes products + categories + collections)
- [ ] `app/robots.ts` (Disallow `/admin`, `/account`, `/cart`, `/checkout`, `/api`)
- [ ] Canonical URLs on dynamic routes; filtered PLP canonical = base category
- [ ] `next/image` everywhere; Cloudinary loader; AVIF/WebP auto; blur placeholders
- [ ] Code splitting + dynamic imports for Razorpay, admin charts
- [ ] Accessibility: focus rings, ARIA, alt text, skip-link, ≥44×44px taps
- [ ] Lighthouse mobile ≥ 90 (Perf, SEO, A11y, Best Practices)
- [ ] Sentry on frontend (`@sentry/nextjs`)

> **Done when:** Lighthouse mobile ≥ 90 across the board, structured data passes validators, all static pages live and linked in footer.

---

### Completion Legend
⬜ Pending · 🟡 In Progress · ✅ Completed (YYYY-MM-DD)
