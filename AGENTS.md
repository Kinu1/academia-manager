# Academia Manager Frontend

## Goal

Build a portfolio-ready React frontend for `AcademiaManager.Api`.

Primary API source:

- Frontend path: `C:\Users\pedro\OneDrive\Área de Trabalho\Projetos\AcademiaManager\frontend`
- Backend path: `C:\Users\pedro\OneDrive\Área de Trabalho\Projetos\AcademiaManager\backend`
- Local Swagger: `http://localhost:5123/swagger`
- OpenAPI JSON: `http://localhost:5123/swagger/v1/swagger.json`

## Working Rules

- Plan first, then implement small vertical slices.
- Keep code production-shaped: typed API client, feature modules, tests, accessible UI, and clear error states.
- Prefer current job-relevant React stack: TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, shadcn/ui, Vitest, Testing Library, MSW, and Playwright.
- Do not hardcode secrets or tokens.
- Keep auth tokens in one isolated storage module so persistence strategy can change later.
- Use API DTO names where useful, but expose frontend-friendly types inside feature modules when UI needs formatting.

## Quality Bar

- Forms validate client-side with Zod and still display server validation errors.
- All protected routes handle logged-out, expired-token, loading, forbidden, and error states.
- CRUD screens support loading, empty, error, and optimistic/refetch states.
- Tests cover auth flow, API error handling, and at least one full CRUD feature before expanding.

## API Notes

Backend currently wraps detail/auth responses as:

```json
{ "data": {} }
```

List endpoints return paged results directly:

```json
{
  "data": [],
  "page": 1,
  "perPage": 20,
  "total": 0,
  "totalPages": 0
}
```

Error shape:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed.",
    "details": []
  }
}
```
