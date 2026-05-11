# Decisions

## Use Vite Instead Of Next.js

This frontend is an authenticated dashboard consuming an existing .NET API. Vite keeps focus on React, routing, data fetching, and CRUD behavior without adding server-rendering complexity that the product does not need.

## Use TanStack Query For API State

The app is CRUD-heavy. TanStack Query handles caching, loading, refetch, invalidation, and mutation state better than storing server data manually in Redux.

## Still Include Redux Toolkit

Redux Toolkit remains common in React job descriptions. This project uses it where it fits: session/auth state and role-aware UI, not duplicated API lists.

## Use React Hook Form And Zod

The app has many forms. React Hook Form keeps forms performant and ergonomic, while Zod gives typed validation schemas that can be shared with tests.

## Use Tailwind CSS And shadcn/ui

This combination is common in modern React dashboards and gives a professional UI without building a full design system from scratch.

## Use MSW For API Tests

MSW lets tests exercise real HTTP flows without requiring the .NET API process during every frontend test run.

## Keep Token Storage Isolated

The first implementation can use local storage for portfolio practicality, but all storage must go through one module. That keeps a future move to memory-only or cookie-based auth contained.

