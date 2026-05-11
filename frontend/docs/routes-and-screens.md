# Routes And Screens

## Public Routes

| Route | Screen | Purpose |
| --- | --- | --- |
| `/login` | Login | Authenticate existing user |
| `/register` | Register | Create user with role |

## Protected Routes

| Route | Screen | Access |
| --- | --- | --- |
| `/` | Dashboard | Authenticated |
| `/students` | Students list | Authenticated |
| `/students/new` | Create student | Admin, Trainer |
| `/students/:id` | Student detail/edit | Authenticated, edit for Admin/Trainer |
| `/plans` | Plans list | Authenticated |
| `/plans/new` | Create plan | Admin |
| `/plans/:id` | Plan detail/edit | Authenticated, edit for Admin |
| `/trainings` | Trainings list | Authenticated |
| `/trainings/new` | Create training | Admin, Trainer |
| `/trainings/:id` | Training detail/edit | Authenticated, edit for Admin/Trainer |
| `/payments` | Payments list | Authenticated |
| `/payments/new` | Create payment | Admin |
| `/payments/:id` | Payment detail/edit | Authenticated, edit for Admin |

## Layout

Protected layout:

- Sidebar navigation
- Top bar with user menu
- Main content area
- Toast region
- Mobile drawer navigation

Sidebar items:

- Dashboard
- Students
- Plans
- Trainings
- Payments

User menu:

- Current user name
- Role badge
- Logout action

## Permission Rules

`Admin`:

- Full read/write/delete access.

`Trainer`:

- Read all resources.
- Create/update/delete trainings.
- Create/update students.
- Cannot manage plans.
- Cannot manage payments.
- Cannot delete students.

`Student`:

- Read-only UI for MVP.
- No create/edit/delete buttons.

## Screen Requirements

List screens:

- Page title
- Primary create action when allowed
- Table
- Pagination
- Loading skeleton
- Empty state
- Error state with retry
- Row action menu

Form screens:

- Client validation with Zod
- Server validation display
- Cancel/back action
- Submit loading state
- Success toast
- Error toast

Detail/edit screens:

- Fetch by id
- Show not found state
- Disable edit actions when role lacks permission

