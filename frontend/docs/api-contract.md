# API Contract

Source: `AcademiaManager.Api` at `..\backend`.

Local base URL:

```txt
http://localhost:5123
```

Swagger:

```txt
http://localhost:5123/swagger
http://localhost:5123/swagger/v1/swagger.json
```

## Auth

`POST /api/v1/auth/register`

Request:

```ts
type RegisterRequest = {
  name: string
  email: string
  password: string
  role: 'Admin' | 'Trainer' | 'Student'
}
```

Response:

```ts
type AuthEnvelope = {
  data: {
    accessToken: string
    refreshToken: string
    expiresAtUtc: string
    user: {
      id: string
      name: string
      email: string
      role: 'Admin' | 'Trainer' | 'Student'
    }
  }
}
```

`POST /api/v1/auth/login`

Request:

```ts
type LoginRequest = {
  email: string
  password: string
}
```

Response: `AuthEnvelope`.

`POST /api/v1/auth/refresh`

Request:

```ts
type RefreshTokenRequest = {
  refreshToken: string
}
```

Response: `AuthEnvelope`.

## Common

Bearer token:

```txt
Authorization: Bearer <accessToken>
```

Paged list response:

```ts
type PagedResult<T> = {
  data: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}
```

Single-item response:

```ts
type ApiResponse<T> = {
  data: T
}
```

Error response:

```ts
type ApiErrorResponse = {
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
      code: string
    }>
  }
}
```

## Students

Routes:

- `GET /api/v1/students?page=1&perPage=20`
- `GET /api/v1/students/{id}`
- `POST /api/v1/students`
- `PUT /api/v1/students/{id}`
- `DELETE /api/v1/students/{id}`

Types:

```ts
type StudentStatus = 'Active' | 'Inactive' | 'Suspended'

type StudentResponse = {
  id: string
  name: string
  email: string
  phone?: string | null
  status: StudentStatus
  planId?: string | null
}

type CreateStudentRequest = {
  name: string
  email: string
  phone?: string | null
  planId?: string | null
}

type UpdateStudentRequest = CreateStudentRequest & {
  status: StudentStatus
}
```

Permissions:

- Read: authenticated users.
- Create/update: `Admin`, `Trainer`.
- Delete: `Admin`.

## Plans

Routes:

- `GET /api/v1/plans?page=1&perPage=20`
- `GET /api/v1/plans/{id}`
- `POST /api/v1/plans`
- `PUT /api/v1/plans/{id}`
- `DELETE /api/v1/plans/{id}`

Types:

```ts
type PlanResponse = {
  id: string
  name: string
  priceAmount: number
  priceCurrency: string
  durationInDays: number
  isActive: boolean
}

type CreatePlanRequest = {
  name: string
  priceAmount: number
  durationInDays: number
}

type UpdatePlanRequest = CreatePlanRequest & {
  isActive: boolean
}
```

Permissions:

- Read: authenticated users.
- Create/update/delete: `Admin`.

## Trainings

Routes:

- `GET /api/v1/trainings?page=1&perPage=20`
- `GET /api/v1/trainings/{id}`
- `POST /api/v1/trainings`
- `PUT /api/v1/trainings/{id}`
- `DELETE /api/v1/trainings/{id}`

Types:

```ts
type TrainingResponse = {
  id: string
  studentId: string
  title: string
  description: string
  scheduledForUtc: string
}

type CreateTrainingRequest = {
  studentId: string
  title: string
  description: string
  scheduledForUtc: string
}

type UpdateTrainingRequest = {
  title: string
  description: string
  scheduledForUtc: string
}
```

Permissions:

- Read: authenticated users.
- Create/update/delete: `Admin`, `Trainer`.

## Payments

Routes:

- `GET /api/v1/payments?page=1&perPage=20`
- `GET /api/v1/payments/{id}`
- `POST /api/v1/payments`
- `PUT /api/v1/payments/{id}`
- `DELETE /api/v1/payments/{id}`

Types:

```ts
type PaymentStatus = 'Pending' | 'Paid' | 'Overdue' | 'Canceled'

type PaymentResponse = {
  id: string
  studentId: string
  amount: number
  currency: string
  dueDateUtc: string
  paidAtUtc?: string | null
  status: PaymentStatus
}

type CreatePaymentRequest = {
  studentId: string
  amount: number
  dueDateUtc: string
}

type UpdatePaymentRequest = {
  amount: number
  dueDateUtc: string
  status: PaymentStatus
}
```

Permissions:

- Read: authenticated users.
- Create/update/delete: `Admin`.
