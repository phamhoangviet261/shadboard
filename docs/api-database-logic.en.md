# API Logic and Database Integration

Last updated: 2026-04-20

## Purpose

This document describes the current backend-related logic in the project, focused on:

- API routes
- authentication flow
- database connection
- Prisma schema
- route protection
- current gaps between the UI and the backend

This is a "current state" note for the repository as it exists now, not an ideal target architecture.

## Tech Stack

- Next.js App Router
- NextAuth.js with `CredentialsProvider`
- Prisma ORM
- PostgreSQL as the current Prisma datasource
- Zod for request validation

## Current Backend Surface

At the moment, the project only exposes two auth API routes:

- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/sign-in/route.ts`

There are UI screens for register, forgot password, verify email, and new password, but their backend APIs are not fully implemented yet.

## High-Level Flow

### 1. Sign-in flow

The current sign-in flow works like this:

1. The UI form in `src/components/auth/sign-in-form.tsx` calls `signIn("credentials")`.
2. NextAuth uses the configuration in `src/configs/next-auth.ts`.
3. The `CredentialsProvider.authorize()` function sends a `POST` request to `${API_URL}/auth/sign-in`.
4. The route `src/app/api/auth/sign-in/route.ts` validates the request body with `SignInSchema`.
5. The route compares the submitted email and password against the static object in `src/data/user.ts`.
6. If the credentials match, the API returns a user payload with `id`, `name`, `email`, `avatar`, and `status`.
7. NextAuth stores that payload in a JWT and exposes it through the session provider.

Important: the sign-in route does **not** currently query Prisma or the database.

### 2. Session flow

The session flow is handled like this:

- `src/configs/next-auth.ts` sets `session.strategy = "jwt"`.
- `jwt` callback copies `id`, `name`, `email`, `avatar`, and `status` from the authenticated user into the token.
- `session` callback copies token values back into `session.user`.
- `src/app/[lang]/layout.tsx` calls `getServerSession(authOptions)` and passes the session into `src/providers/index.tsx`.
- `src/providers/next-auth-provider.tsx` wraps the app with `SessionProvider`.

Because the app uses JWT sessions, the `Session` table is prepared in Prisma but is not the main runtime mechanism for the current credentials login flow.

### 3. Route protection flow

Route protection is defined by:

- `src/configs/auth-routes.ts`
- `src/lib/auth-routes.ts`
- `src/middleware.ts`

Behavior:

- guest routes: only for unauthenticated users
- public routes: available to everyone
- all other routes: treated as protected by default

Current route map:

- guest: `/sign-in`, `/register`, `/forgot-password`, `/verify-email`, `/new-password`
- public: `/`, `/me`, `/docs`

The middleware checks the JWT with `getToken()` from `next-auth/jwt`. If a protected page is requested without a token, the user is redirected to `/sign-in`.

## Implemented API Routes

### `POST /api/auth/sign-in`

File: `src/app/api/auth/sign-in/route.ts`

Request body:

```json
{
  "email": "name@example.com",
  "password": "Password123"
}
```

Validation:

- Uses `src/schemas/sign-in-schema.ts`
- `email` must be valid, lowercase, and trimmed
- `password` must be 8-250 characters and contain at least one letter and one number

Current logic:

- compares request values to `src/data/user.ts`
- returns `401` if credentials do not match
- returns `200` with user profile fields if credentials match
- returns `400` if Zod validation fails
- returns `500` for unexpected errors

Returned payload on success:

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "status": "string"
}
```

### `GET|POST /api/auth/[...nextauth]`

File: `src/app/api/auth/[...nextauth]/route.ts`

This route delegates all NextAuth handling to:

- `src/configs/next-auth.ts`

It is the entry point for:

- credentials login
- session creation
- auth callbacks

## Database Connection

### Prisma client

File: `src/lib/prisma.ts`

The project creates a Prisma singleton:

- `new PrismaClient()` is created once
- in non-production, the instance is cached on `globalThis.prisma`
- this avoids creating multiple Prisma clients during hot reload

### Datasource

File: `prisma/schema.prisma`

Current datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

That means the runtime database connection depends on `DATABASE_URL`.

### NextAuth adapter

File: `src/configs/next-auth.ts`

NextAuth is wired to Prisma with:

```ts
adapter: PrismaAdapter(db)
```

However, in the current codebase:

- the only configured provider is `CredentialsProvider`
- the credentials login itself uses the internal sign-in API
- that sign-in API validates against static demo data, not Prisma queries

So the Prisma adapter is configured, but the active credentials login path is still mostly demo logic.

## Current Prisma Schema

File: `prisma/schema.prisma`

### `User`

Main auth/user identity model.

Key fields:

- `id`
- `name`
- `username`
- `email`
- `emailVerifyToken`
- `emailVerified`
- `password`
- `passwordResetToken`
- `passwordResetExpires`
- `avatar`
- `profileBackground`
- `status`
- `createdAt`
- `updatedAt`

Relations:

- one-to-one with `UserPreference`
- one-to-many with `Account`
- one-to-many with `Session`

### `UserPreference`

Stores UI preferences for a single user.

Fields:

- `theme`
- `mode`
- `radius`
- `layout`
- `direction`
- `userId`

### `Account`

Standard NextAuth adapter table for external auth providers.

Fields include:

- `provider`
- `providerAccountId`
- `access_token`
- `refresh_token`
- `expires_at`

Current note: this table is ready for OAuth-style providers, but the current project only uses credentials login.

### `Session`

Standard NextAuth session table.

Fields:

- `sessionToken`
- `userId`
- `expires`

Current note: the app currently uses JWT sessions, so this table is not central to the active sign-in flow.

### `VerificationToken`

Standard token table for email/token-based auth flows.

Fields:

- `identifier`
- `token`
- `expires`

Current note: the schema is ready for verification/reset flows, but those flows are not fully implemented in the API yet.

## Validation Schemas Already Present

The project already includes Zod schemas for these flows:

- `src/schemas/sign-in-schema.ts`
- `src/schemas/register-schema.ts`
- `src/schemas/forgot-passward-schema.ts`
- `src/schemas/new-passward-schema.ts`
- `src/schemas/verify-email-schema.ts`

This means the UI validation structure already exists even though several backend routes are still missing.

## Current Gaps and Inconsistencies

These are the main things to remember before extending the backend:

### 1. Sign-in is still demo-based

`POST /api/auth/sign-in` checks credentials against `src/data/user.ts`, not the `User` table.

### 2. Register UI points to a missing API route

`src/components/auth/register-form.tsx` sends `POST /api/register`, but there is no matching route in `src/app/api`.

### 3. Verify email UI points to a missing API route

`src/components/auth/verify-email-form.tsx` sends `POST /api/auth/verify-email`, but that route does not exist yet.

### 4. Forgot password and new password are UI-only

- `src/components/auth/forgot-password-form.tsx` currently only shows a toast
- `src/components/auth/new-password-form.tsx` currently only shows a toast

No database write or token verification happens yet.

### 5. Session callback has a status assignment bug

In `src/configs/next-auth.ts`, the session callback currently does this:

```ts
token.status = token.status
```

It likely intended to set:

```ts
session.user.status = token.status
```

So `status` is stored in the JWT, but is not copied correctly into `session.user`.

### 6. Prisma schema and migration history are not aligned

- `prisma/schema.prisma` currently contains only auth-related models
- `prisma/migrations/20241026151136_init/migration.sql` still contains older chat-related tables

For future work, treat `prisma/schema.prisma` as the current source of truth and review the migration history before running new migrations.

### 7. `.env.example` is outdated

`prisma/schema.prisma` expects PostgreSQL, but `.env.example` still shows:

```env
DATABASE_URL=file:./dev.db
```

That example no longer matches the current Prisma datasource configuration.

## Recommended Next Backend Steps

If the goal is to move from demo auth to real database-backed auth, the next steps should be:

1. Implement `POST /api/register` and create users in Prisma.
2. Hash passwords before storing them in `User.password`.
3. Replace static credential comparison in `/api/auth/sign-in` with `db.user.findUnique()`.
4. Compare passwords with a secure password hashing library.
5. Implement `/api/auth/verify-email`.
6. Implement forgot-password and reset-password APIs using `passwordResetToken` and `passwordResetExpires`.
7. Fix the `session.user.status` callback assignment.
8. Update `.env.example` to PostgreSQL.
9. Reconcile Prisma migrations with the current schema.

## Quick Reference

### Main files

- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `src/configs/next-auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/sign-in/route.ts`
- `src/components/auth/sign-in-form.tsx`
- `src/components/auth/register-form.tsx`
- `src/components/auth/forgot-password-form.tsx`
- `src/components/auth/new-password-form.tsx`
- `src/components/auth/verify-email-form.tsx`
- `src/middleware.ts`
- `src/configs/auth-routes.ts`

### Environment variables in use

- `BASE_URL`
- `API_URL`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `HOME_PATHNAME`
- `NEXT_PUBLIC_HOME_PATHNAME`
