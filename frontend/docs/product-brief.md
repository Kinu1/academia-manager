# Product Brief

## Product

`Academia Manager` is an admin dashboard for gym operations. The frontend consumes `AcademiaManager.Api` and exposes authenticated workflows for managing students, plans, trainings, and payments.

## Target User

Small gym owner, admin clerk, or trainer. The UI should feel like an internal SaaS tool: dense, clear, fast to scan, and practical for repeated daily use.

## Portfolio Goal

Show junior full-stack readiness through a real API integration, typed forms, auth, protected routing, data fetching, CRUD flows, tests, and polished UI.

## Primary Workflows

- Register/login user.
- View dashboard summary from students, plans, trainings, and payments.
- Manage students and connect them to plans.
- Manage membership plans.
- Schedule and update trainings.
- Register and update payments.
- Handle permissions by role.

## Roles

- `Admin`: full access, including create/update/delete plans, students, trainings, and payments.
- `Trainer`: can manage students and trainings.
- `Student`: read-only experience or limited dashboard, depending on API behavior.

## UX Direction

- Sidebar layout with compact navigation.
- Data tables with pagination controls.
- Dialog or page forms for create/edit flows.
- Status badges for student and payment states.
- Clear empty states and server-error messages.
- No marketing landing page.

