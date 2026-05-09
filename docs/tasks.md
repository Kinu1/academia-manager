# Implementation Tasks

## Phase 1 - Project Setup

- Scaffold Vite React TypeScript app.
- Install routing, data, form, validation, UI, testing, and lint packages.
- Configure Tailwind CSS and shadcn/ui.
- Add environment config with `VITE_API_BASE_URL=http://localhost:5123`.
- Add base layout and routing.

## Phase 2 - API Foundation

- Create Axios client.
- Add token injection.
- Add typed error normalization.
- Add refresh-token flow.
- Add TanStack Query provider.
- Add MSW test server.

## Phase 3 - Auth

- Build login page.
- Build register page.
- Persist session.
- Add protected routes.
- Add role-based UI guards.
- Test successful login, invalid login, expired session, and logout.

## Phase 4 - Plans

- List plans with pagination.
- Create plan form.
- Edit plan form.
- Delete plan action.
- Add role restrictions for admin-only actions.
- Test CRUD happy path and validation errors.

## Phase 5 - Students

- List students with pagination.
- Create/edit student with plan selector.
- Show student status badges.
- Delete student as admin only.
- Test student form and table behavior.

## Phase 6 - Trainings

- List trainings by scheduled date order.
- Create/edit training with student selector.
- Use date-time input and convert to UTC ISO string.
- Delete training for admin/trainer.

## Phase 7 - Payments

- List payments with status badges.
- Create payment with student selector.
- Edit payment status.
- Format amount and due date.
- Add dashboard payment summary.

## Phase 8 - Dashboard And Polish

- Add metrics cards from paged endpoints.
- Add recent trainings and overdue/pending payments.
- Add responsive navigation.
- Add loading skeletons, empty states, and toast feedback.
- Run unit/integration/E2E checks.

## Phase 9 - Portfolio Finish

- Add README with stack, screenshots, API setup, scripts, and test commands.
- Add `.env.example`.
- Add deployment notes.
- Add architecture summary for recruiters.

