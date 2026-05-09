# Frontend Architecture

## Stack

- React + TypeScript + Vite
- React Router
- TanStack Query
- Axios
- React Hook Form + Zod
- Redux Toolkit for auth/session state
- Tailwind CSS + shadcn/ui + Radix UI + lucide-react
- Vitest + React Testing Library + MSW
- Playwright
- ESLint + Prettier + Husky + lint-staged

## Source Layout

```txt
src/
  app/
    providers/
    router/
    layouts/
  shared/
    api/
    config/
    lib/
    ui/
    hooks/
    types/
  features/
    auth/
    students/
    plans/
    trainings/
    payments/
    dashboard/
  pages/
  widgets/
  test/
```

## API Layer

`shared/api/http-client.ts`

- Owns Axios instance.
- Adds `Authorization` header.
- Normalizes API errors into one frontend error type.
- Handles `401` with refresh-token flow when possible.

`shared/api/types.ts`

- Shared envelope types: `ApiResponse<T>`, `PagedResult<T>`, `ApiErrorResponse`.

Feature API modules:

- `features/auth/api/auth-api.ts`
- `features/students/api/students-api.ts`
- `features/plans/api/plans-api.ts`
- `features/trainings/api/trainings-api.ts`
- `features/payments/api/payments-api.ts`

## State Strategy

Use TanStack Query for server state:

- lists
- detail records
- mutations
- cache invalidation
- loading/error states

Use Redux Toolkit only for app/session state:

- authenticated user
- token metadata
- role
- logout action

Do not duplicate API lists in Redux.

## Routing

```txt
/login
/register
/
/students
/students/:id
/plans
/plans/:id
/trainings
/trainings/:id
/payments
/payments/:id
```

Protected layout:

- Checks auth session.
- Redirects unauthenticated users to `/login`.
- Shows role-aware navigation.

## Feature Slice Shape

```txt
features/students/
  api/
  components/
  hooks/
  schemas/
  types/
  pages/
```

## UI System

Use shadcn/ui primitives for:

- Button
- Input
- Select
- Dialog
- Table
- DropdownMenu
- Badge
- Toast
- Pagination

Use lucide-react icons for actions:

- create
- edit
- delete
- search
- filter
- logout

## Testing Strategy

Unit:

- Zod schemas
- formatters
- auth storage

Integration:

- login form with MSW
- one CRUD page with table + form + mutation
- HTTP client error normalization

E2E:

- login
- create plan
- create student
- schedule training
- register payment

