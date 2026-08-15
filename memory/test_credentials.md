# Mock test credentials (frontend phase · NEXT_PUBLIC_USE_MOCKS=true)

Defined in `/app/frontend/src/mocks/users.mock.ts`. The mock auth service
accepts these emails; passwords below match `frontend_workflow.md` §6.

| Role | Email | Password |
|---|---|---|
| Customer | `customer@bhavita.test` | `Customer@123` |
| Admin | `admin@bhavita.test` | `Admin@1234` |
| Super Admin | `super@bhavita.test` | `Super@1234` |

Notes:
- Access token is stored in memory only (see `src/lib/api.ts`).
- Mock session lives in `src/mocks/_session.ts`.
- No real auth backend exists yet; do not treat these as production credentials.
