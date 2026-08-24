# Bhavita Textiles Frontend PRD

## Original problem statement
Run and verify why no UI is visible, and make the theme/colour like https://bhavitatextiles.lovable.app/.

## Architecture decisions
- Frontend-only work in the existing Next.js app; backend was not started or modified.
- Preserve the luxury editorial textile storefront structure with warm ivory, charcoal, muted gold, serif display headings, and Manrope body text.
- Keep existing service and mock-runtime behavior unchanged.

## Implemented
- Confirmed the blank preview was caused by the frontend supervisor process exiting because `next start` could not find `.next/BUILD_ID`.
- Built the existing frontend and restarted only the frontend process; homepage serves successfully on port 3000.
- Verified desktop and mobile homepage rendering, themed hero, navigation, catalogue sections, plant-scale section, wholesale CTA, footer, and no horizontal overflow.
- Fixed the mobile drawer duplicate close control by disabling the Sheet primitive close button when the custom close button is present.
- Forwarded the global search test ID to rendered dialog content and added rejected-search handling.

## Prioritized backlog
- P0: Provide the frontend runtime environment value required for live external preview validation (`REACT_APP_BACKEND_URL`) without starting the backend in this task.
- P1: Re-run the live search interaction check once the frontend environment is available.
- P2: Replace the existing MOCKED API/services with connected production data when backend work is explicitly requested.