# MVP Scope

## Objective

Build the first usable version of the Academia Manager frontend as a protected dashboard connected to `AcademiaManager.Api`.

The MVP must prove:

- real authentication with JWT
- protected routes
- role-aware UI
- typed API calls
- CRUD screens
- form validation
- useful dashboard
- tests for core flows

## In Scope

Authentication:

- Login
- Register
- Refresh token
- Logout
- Persisted session
- Protected layout
- Role-aware actions

Dashboard:

- Total students
- Total active plans
- Total trainings
- Total payments
- Recent trainings
- Pending or overdue payments

Plans:

- List plans
- Create plan
- Edit plan
- Delete plan
- Show active/inactive status

Students:

- List students
- Create student
- Edit student
- Delete student
- Assign plan
- Show status: `Active`, `Inactive`, `Suspended`

Trainings:

- List trainings
- Create training
- Edit training
- Delete training
- Link training to student
- Show scheduled date/time

Payments:

- List payments
- Create payment
- Edit payment
- Delete payment
- Show status: `Pending`, `Paid`, `Overdue`, `Canceled`

Quality:

- Loading states
- Empty states
- Error states
- Toast feedback
- Responsive layout
- Unit/integration tests for first critical flows

## Out Of Scope For MVP

- File upload
- Charts beyond simple dashboard metrics
- Complex search/filtering
- Realtime updates
- Dark mode
- Multi-language support
- Full audit log
- Student self-service portal
- Payment gateway integration

## MVP Delivery Order

1. Project setup and UI foundation.
2. API client, auth storage, and query provider.
3. Login/register and protected routes.
4. Plans CRUD.
5. Students CRUD.
6. Trainings CRUD.
7. Payments CRUD.
8. Dashboard summary.
9. Tests, README, and portfolio polish.

