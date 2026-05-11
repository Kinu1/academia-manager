# Acceptance Criteria

## Project Ready

- `npm run dev` starts app.
- `npm run build` succeeds.
- `npm run lint` succeeds.
- `npm run test` succeeds.
- `.env.example` documents `VITE_API_BASE_URL`.
- README explains how to run frontend with backend.

## Auth Ready

- User can register.
- User can login.
- App stores access token, refresh token, expiry, and user.
- Protected routes redirect unauthenticated users to `/login`.
- Logout clears session and redirects to `/login`.
- Expired access token attempts refresh once.
- Failed refresh clears session.
- API errors display useful messages.

## CRUD Ready

For each resource:

- List page loads data.
- Pagination uses `page` and `perPage`.
- Create flow works when role allows it.
- Edit flow works when role allows it.
- Delete flow works when role allows it.
- Forbidden actions are hidden or disabled.
- Empty state appears when no items exist.
- Error state appears when API fails.
- Success and failure toasts appear after mutations.

## UI Ready

- Layout works on desktop and mobile.
- Tables do not overflow badly on small screens.
- Forms have labels and validation messages.
- Buttons show loading state during submit/delete.
- Status fields use badges.
- Date and currency values are formatted for `pt-BR`.

## Test Ready

- Auth flow covered with MSW.
- Plans CRUD has integration tests.
- At least one protected-route test exists.
- At least one permission-rendering test exists.
- Playwright covers login and one create flow.

## Portfolio Ready

- README lists stack and architecture choices.
- README includes API dependency and local setup.
- Project has clear screenshots or screenshot instructions.
- Code demonstrates TypeScript, REST integration, state management, forms, validation, tests, and role handling.

