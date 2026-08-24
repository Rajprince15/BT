# Bhavita Textiles Frontend PRD

## Original problem statement
Frontend-only update based on the Bhavita Textiles reference About and Products pages: rename Our Mill to Our Heritage, adapt the heritage content, replace Contact with Bulk Enquiry, show existing product sizes and prices on that page, and switch checkout from Razorpay to a WhatsApp request when `REACT_APP_RAZORPAY_ENABLED=false`. The backend must remain untouched and not be started.

## Architecture decisions
- Kept the existing Next.js frontend, typed service layer, and existing product/cart/wholesale contracts so the later backend can replace service internals without page changes.
- Added a build-time environment flag exposed through `next.config.mjs`; false routes review directly to the existing WhatsApp widget number, true preserves the existing Razorpay flow.
- Reused existing catalogue products with `moq`, `sizeLabel`, `specification`, and existing/sale prices for Bulk Enquiry.

## Implemented
- Replaced `/about` with the adapted Our Heritage page: Panipat story, milestones, five-stage quality assurance, operating stats, factory CTA, and reference loom imagery.
- Updated desktop, mobile, mega-menu, and footer navigation; `/contact` is now the Bulk Enquiry page and the desktop top-right CTA was removed.
- Added selectable bulk catalogue items, quantities, existing prices, sizes, specs, MOQ, customer form, and encoded WhatsApp enquiry payload.
- Added `REACT_APP_RAZORPAY_ENABLED=false` to frontend environment examples and wired checkout Review to send cart items, prices, total, address, and delivery method to WhatsApp when disabled.
- Lint passed; production route generation completed; frontend interaction testing reported no defects. Backend was intentionally not tested or started.

## Prioritized backlog
- P0: Replace the placeholder WhatsApp number in `frontend/src/components/layout/WhatsAppWidget.tsx` before production use.
- P1: Validate the real wholesale API and real Razorpay-enabled checkout after backend integration is requested.
- P2: Add server-side quote/order validation so production pricing is rechecked before fulfilment.