# Bhavita Textiles Redesign

## Original problem statement
Redesign the existing Bhavita Textiles website to match the theme, colors, visual hierarchy, layout, and content of https://bhavitatextiles.lovable.app/. Add a frontend-only WhatsApp button using a configurable number, exact product image links with local filename-based overrides, preserve important existing features, remove account and notification controls from the public header, and provide free contact/wholesale/footer enquiry handoffs.

## Architecture decisions
- Keep the existing Next.js App Router and public catalogue routes.
- Use the reference site’s cream paper, charcoal, and gold palette with serif headings and Manrope body text.
- Keep contact and wholesale on the existing frontend service layer; in mock mode, open WhatsApp with submitted details.
- Product images first request `/images/products/<slug>.jpg`; the client component switches to the exact remote product image when the local file is absent.
- WhatsApp configuration lives in `components/layout/WhatsAppWidget.tsx` so the placeholder number and message have one edit point.

## Implemented
- Rebuilt the homepage around the Panipat manufacturing story, featured range, plant scale, procurement benefits, and bulk RFQ CTA.
- Replaced the public header/footer with manufacturer-focused navigation and contact links.
- Added a site-wide floating WhatsApp CTA and WhatsApp handoffs for contact and wholesale forms.
- Updated theme tokens, texture treatment, remote image allow-list, and robust product image fallback.
- Fixed static rendering boundaries on login and checkout success pages so all 39 Next routes build.
- Updated frontend package-manager metadata so the supervisor can start the current Next frontend.
- Restored local cart, wishlist, search, theme toggle, and mobile navigation; only account and notification controls are hidden from the public header.


## Prioritized backlog
- P0: Replace the temporary WhatsApp number and configure the owner’s preferred reply email.
- P1: Align the supervisor/backend entrypoint with the repository’s Node backend if API persistence is required.
- P1: Replace mock contact, wholesale, and catalogue services with live services when backend persistence is ready.
- P2: Add the remaining seven-category content and product-specific image files under `public/images/products`.

## Verification
- TypeScript/TSX lint passed.
- Production build passed all 39 routes with `yarn build`.
- Reference product asset returned HTTP 200.
- Browser pass rendered the redesigned homepage; intermittent Cloudflare verification can block automated preview navigation.
- Contact, wholesale, and catalogue service layers remain MOCKED in frontend mock mode; no backend persistence is active.