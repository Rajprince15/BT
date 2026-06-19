# Frontend Architecture

This project follows a strict layered architecture:

- **Pages**: Next.js App Router pages and routes.
- **Components**: Pure UI components that receive props only.
- **Hooks**: React Query hooks and local state hooks. Hooks call only `services/*`.
- **Services**: The single data boundary. In frontend phase services return mock data from `mocks/*`; in backend phase they swap to Axios calls.
- **Mocks / API**: Mock data is isolated to `services` during frontend development. Real HTTP calls live in `services` after backend integration.

## Data flow

```text
Pages
  ↓
Components
  ↓
Hooks
  ↓
Services
  ↓
[Mocks | API]
```

## Contract guarantees

- `app/**` and `components/**` must not import `@/mocks/*` or `axios`.
- `hooks/**` may only import from `@/services/*`.
- `services/*` is the only layer that directly contacts `mocks/*` or `@/lib/api`.
- TypeScript interfaces in `src/types/` are shared across pages, mocks, services, and the backend contract mapping.
