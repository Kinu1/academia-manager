# Feature Breakdown

## Shared Foundation

Files:

```txt
src/shared/config/env.ts
src/shared/api/http-client.ts
src/shared/api/api-error.ts
src/shared/api/types.ts
src/shared/lib/formatters.ts
src/shared/lib/permissions.ts
src/shared/ui/*
```

Responsibilities:

- Environment validation.
- Axios setup.
- Token header.
- Refresh-token retry.
- Error normalization.
- Shared API envelope types.
- Date/currency formatters.
- Role permission helpers.

## Auth Feature

Files:

```txt
src/features/auth/api/auth-api.ts
src/features/auth/model/auth-slice.ts
src/features/auth/model/auth-storage.ts
src/features/auth/hooks/use-auth.ts
src/features/auth/schemas/auth-schemas.ts
src/features/auth/pages/login-page.tsx
src/features/auth/pages/register-page.tsx
src/features/auth/components/auth-form-shell.tsx
```

Responsibilities:

- Login.
- Register.
- Refresh.
- Logout.
- Store session.
- Expose current user.
- Guard routes.

First tests:

- Login success stores session and redirects.
- Login failure shows API error.
- Logout clears session.

## Plans Feature

Files:

```txt
src/features/plans/api/plans-api.ts
src/features/plans/hooks/use-plans.ts
src/features/plans/schemas/plan-schemas.ts
src/features/plans/pages/plans-page.tsx
src/features/plans/pages/plan-form-page.tsx
src/features/plans/components/plans-table.tsx
src/features/plans/components/plan-form.tsx
```

Responsibilities:

- List plans.
- Create plan.
- Update plan.
- Delete plan.
- Show active badge.

First tests:

- Create plan form validates required fields.
- Successful create invalidates plans query.
- Non-admin cannot see write actions.

## Students Feature

Files:

```txt
src/features/students/api/students-api.ts
src/features/students/hooks/use-students.ts
src/features/students/schemas/student-schemas.ts
src/features/students/pages/students-page.tsx
src/features/students/pages/student-form-page.tsx
src/features/students/components/students-table.tsx
src/features/students/components/student-form.tsx
```

Responsibilities:

- List students.
- Create student.
- Update student.
- Delete student.
- Select plan.
- Show status badge.

First tests:

- Student form validates email.
- Plan selector loads plans.
- Trainer can create/update but cannot delete.

## Trainings Feature

Files:

```txt
src/features/trainings/api/trainings-api.ts
src/features/trainings/hooks/use-trainings.ts
src/features/trainings/schemas/training-schemas.ts
src/features/trainings/pages/trainings-page.tsx
src/features/trainings/pages/training-form-page.tsx
src/features/trainings/components/trainings-table.tsx
src/features/trainings/components/training-form.tsx
```

Responsibilities:

- List trainings.
- Create training.
- Update training.
- Delete training.
- Select student.
- Convert local date-time to UTC ISO string.

First tests:

- Date-time field serializes to ISO string.
- Trainer can manage trainings.
- Student cannot see write actions.

## Payments Feature

Files:

```txt
src/features/payments/api/payments-api.ts
src/features/payments/hooks/use-payments.ts
src/features/payments/schemas/payment-schemas.ts
src/features/payments/pages/payments-page.tsx
src/features/payments/pages/payment-form-page.tsx
src/features/payments/components/payments-table.tsx
src/features/payments/components/payment-form.tsx
```

Responsibilities:

- List payments.
- Create payment.
- Update payment.
- Delete payment.
- Select student.
- Format money.
- Show payment status badge.

First tests:

- Amount validation rejects zero/negative values.
- Admin can create payment.
- Trainer cannot see payment write actions.

## Dashboard Feature

Files:

```txt
src/features/dashboard/pages/dashboard-page.tsx
src/features/dashboard/components/metric-card.tsx
src/features/dashboard/components/recent-trainings.tsx
src/features/dashboard/components/payment-alerts.tsx
```

Responsibilities:

- Fetch first page of each resource.
- Use `total` for metrics.
- Show recent trainings from list.
- Show pending/overdue payments.

First tests:

- Dashboard renders totals from paged responses.
- API error shows retry state.

