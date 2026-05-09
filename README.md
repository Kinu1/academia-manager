# Academia Manager Frontend

React dashboard for `AcademiaManager.Api`.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Redux Toolkit
- React Hook Form + Zod
- Tailwind CSS
- Vitest + Testing Library
- MSW and Playwright installed for next testing phases

## Requirements

- Node.js 24+
- `AcademiaManager.Api` running at `http://localhost:5123`

Backend local path used during planning:

```txt
C:\Users\pedro\AcademiaManagerApi
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run format
```

## Current Status

Implemented:

- Vite React TypeScript scaffold
- Tailwind CSS config
- API client with JWT header and refresh retry
- Redux auth session state
- Login and register pages
- Protected dashboard layout
- Dashboard metric calls
- Plans CRUD list/create/edit/delete
- Admin-only plan write guards
- Students CRUD list/create/edit/delete
- Student plan selector and Admin/Trainer write guards
- Trainings CRUD list/create/edit/delete
- Training student selector and local datetime to UTC conversion
- Base UI primitives
- First validation and permission tests

Next slice:

- Payments CRUD with student selector and Admin-only permissions.
