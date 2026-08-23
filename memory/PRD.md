# Bhavita Textiles Redesign

## Original problem statement
Comprehensively redesign the existing Bhavita Textiles website using https://bhavitatextiles.lovable.app/ as the primary visual, layout, hierarchy, UX and content inspiration while preserving the original website's core features and routes. The redesign must be responsive for desktop, tablet and mobile, and work only with code files without starting frontend or backend services.

## User choices
- Preserve core functionality while allowing small UX improvements that do not add features.
- Reuse the reference site's visible content and history language.
- Support desktop, tablet and mobile.
- Do not start or restart frontend or backend services.

## Architecture decisions
- Preserved the Next.js storefront, service layer, hooks, route structure, account, checkout, admin, wholesale and catalogue flows.
- Changed the shared visual layer and primary homepage experience only: earthy mill-inspired palette, Cormorant Garamond plus Plus Jakarta Sans, procurement-led messaging, responsive sections and stronger accessibility metadata.
- Kept existing mock/service-layer data integrations untouched.

## Implemented
- Reworked global tokens, fonts, metadata and responsive base styling.
- Redesigned Header and Footer while preserving search, mobile navigation, cart, wishlist, account, notification, theme and newsletter interactions.
- Redesigned HeroCarousel, FeaturedCategories, BrandStory and WholesaleCTA around the reference site's Panipat manufacturing story.
- Added keyboard arrow navigation to the hero carousel and removed nested main landmarks.
- Corrected the self-referential border token in globals.css.

## Prioritized backlog
- P0: Run a browser responsive/accessibility pass when a preview is intentionally available.
- P1: Replace remaining legacy editorial fallback illustrations with approved textile photography.
- P1: Align the remaining homepage product, seasonal and testimonial sections with the new visual system.
- P2: Connect catalogue and RFQ copy to production content once backend data is available.

## Verification
- ESLint passed for all rewritten TypeScript/TSX files.
- Static frontend review completed with three findings; all three were fixed.
- Frontend and backend services were not started or restarted, per user instruction.
- `npx tsc --noEmit` is blocked by the existing `tsconfig.json` `ignoreDeprecations` setting being rejected by the installed TypeScript version.