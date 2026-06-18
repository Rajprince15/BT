# Bhavita Textiles — Project Workflow

This repo contains the **phased build plan** for the Bhavita Textiles luxury e-commerce platform.

Each phase is sized to **5–6 credits** of LLM work. Heavy phases were split into **A / B** sub-phases so every phase fits the budget — **no feature has been removed** from `BT_Project_plan.md`. The implementing LLM MUST mark a phase as `✅ COMPLETED (YYYY-MM-DD)` in the workflow file ONLY after every task in that phase has been implemented and verified.

## Files
- [`backend_workflow.md`](./backend_workflow.md) — 19 phases for the Node.js + MySQL APIs, integrations, deployment
- [`frontend_workflow.md`](./frontend_workflow.md) — 17 phases for the Next.js 15 storefront + admin UI
- [`BT_Project_plan.md`](./BT_Project_plan.md) — full original product brief (historical context, fully inlined into the two workflow files)
- [`schema.sql`](./schema.sql) — MySQL 8.0 schema (source of truth for DB)
- [`Prompt.md`](./Prompt.md) — kickoff prompt for the implementing LLM

## Phase Map (after split — every phase ≈ 5–6 credits)

### Backend (19 phases)
| # | Phase |
|---|---|
| 0 | Foundation Brief & Contract Lock-in (2–3) |
| 1A | Project Foundation, TS Setup & MySQL Migrations |
| 1B | Seed Data, Module Skeletons & Healthcheck |
| 2A | Auth Core (register / login / refresh / logout / me / change-pwd) |
| 2B | Password Reset, Email Verification & All Email Templates |
| 3A | Auth, Role, Ownership Middleware & zod Validation |
| 3B | Helmet/CSP, CORS, Rate-Limit, CSRF, Lockout, Security Logs |
| 4A | Public Categories & Products APIs |
| 4B | Admin Categories & Products CRUD, Variants, Stock & Publish |
| 5 | Cloudinary Integration & Media APIs |
| 6A | Cart APIs & Coupon Validation |
| 6B | Wishlist & Address Book APIs |
| 7A | Checkout Quote, Razorpay Order, Verify & Stock Transaction |
| 7B | Orders (list/detail/cancel), Webhooks & PDF Invoice |
| 8A | Admin Dashboard KPIs, Orders & Customers |
| 8B | Admin Coupons, Banners, Reviews, Wholesale, Users & Audit Logs |
| 9 | Reviews, Wholesale, Newsletter & Contact APIs |
| 10A | SEO Endpoints, Logging & Monitoring |
| 10B | Backups, Docker, VPS Deployment & Go-Live |

### Frontend (17 phases)
| # | Phase |
|---|---|
| 0 | Foundation Brief & Contract Lock-in (2–3) |
| 1 | Project Setup & Luxury Design System |
| 2 | Global Layout, Header, Mega-menu, Footer & Theming |
| 3A | Home: Hero, Featured Categories, New Arrivals, Best Sellers |
| 3B | Home: Seasonal, Handloom Heritage, Testimonials, Brand Story, Wholesale CTA, Newsletter |
| 4 | Shop / Category PLP, Filters, Sort, Pagination, Search, Collections |
| 5A | PDP: Gallery, Info, Variants, Add to Cart/Wishlist, Tabs |
| 5B | PDP: Reviews, Write-Review, Related, JSON-LD, Share, Breadcrumbs |
| 6 | Authentication Pages & Auth Flow |
| 7A | Cart, Wishlist Pages & Coupon UI |
| 7B | Checkout Multi-step, Razorpay UI, Success & Invoice DL |
| 8A | Account: Layout, Profile, Addresses, Change Password |
| 8B | Account: Orders, Cancel, Re-order, Reviews-to-write, Wishlist |
| 9A | Admin: Layout, Dashboard, Categories, Products CRUD |
| 9B | Admin: Orders, Customers, Wholesale, Coupons, Banners, Reviews, Audit, Settings |
| 10A | Static Pages & Public Forms |
| 10B | SEO, Performance, Accessibility & Polish |

## Workflow Rules for the LLM
1. Work on phases **in order**, one at a time.
2. Before starting a phase, change its status to `🟡 In Progress` in both the Progress Overview table and the phase header.
3. After finishing **all** tasks in a phase, change the status to `✅ Completed (YYYY-MM-DD)` in both places and tick every task checkbox `[x]`.
4. Do not move on to the next phase until the current one is fully verified.
5. Keep each phase scoped to 5–6 credits — split into a further sub-phase if it grows larger.

## Status Legend
- ⬜ Pending
- 🟡 In Progress
- ✅ Completed (YYYY-MM-DD)
"