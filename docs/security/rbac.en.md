# Role-Based Access Control (RBAC) System

This document outlines the permission system for the Lensora administrative dashboard.

## Roles

The system supports four distinct roles:

1.  **Admin**: Full access to all features. Can manage users and roles.
2.  **Manager**: Full category and product management. Can adjust stock and view analytics.
3.  **Editor**: Can view and edit products/collections but cannot delete them or adjust stock.
4.  **Viewer**: Read-only access to products and collections. Cannot access analytics or logs.

## Permission Mapping

| Permission | Admin | Manager | Editor | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **Products** | | | | |
| `products:view` | ✅ | ✅ | ✅ | ✅ |
| `products:create` | ✅ | ✅ | ✅ | ❌ |
| `products:update` | ✅ | ✅ | ✅ | ❌ |
| `products:delete` | ✅ | ✅ | ❌ | ❌ |
| `products:duplicate` | ✅ | ✅ | ✅ | ❌ |
| `products:bulk-update` | ✅ | ✅ | ❌ | ❌ |
| **Collections** | | | | |
| `collections:manage` | ✅ | ✅ | ✅ | ❌ |
| **Inventory** | | | | |
| `inventory:view` | ✅ | ✅ | ✅ | ✅ |
| `inventory:adjust` | ✅ | ✅ | ❌ | ❌ |
| **System** | | | | |
| `analytics:view` | ✅ | ✅ | ❌ | ❌ |
| `activity-logs:view` | ✅ | ❌ | ❌ | ❌ |
| `aiContent:generate` | ✅ | ✅ | ✅ | ❌ |

## Security Implementation

### Backend (Server-Side)
API routes are secured using the `authenticateUser(requiredPermission)` helper. Unauthorized requests return a `403 Forbidden` status.

### Frontend (Client-Side)
The UI is protected using the `usePermission` hook. Restricted buttons are hidden or disabled, and direct navigation to unauthorized pages is blocked by the `UnauthorizedState` component.

## Audit Logs
Every administrative action is logged with the `actorRole` field, ensuring a complete audit trail of who did what and under which role.

## Development Test Accounts

> [!WARNING]
> These accounts are for **local/development testing only**. Do not use these in a production environment.

### Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@vietpham.com` | `Admin@123456` |
| **Manager** | `manager@vietpham.com` | `Manager@123456` |
| **Editor** | `editor@vietpham.com` | `Editor@123456` |
| **Viewer** | `viewer@vietpham.com` | `Viewer@123456` |

### Database Seeding

To insert or update these test accounts in your local database, run:

```bash
pnpm db:seed
```

This command uses `prisma/seed.ts` to securely hash passwords and upsert user records.

## Manual Testing Guide

1.  **Run the seed command**: `pnpm db:seed`
2.  **Login**: Use the credentials above at the login screen.
3.  **Verify Permissions**: 
    - As **Viewer**, try to access the "Analytics" page (should be blocked).
    - As **Editor**, try to delete a product (the delete button should be hidden or disabled).
    - As **Manager**, try to adjust stock in the Inventory tab.
    - As **Admin**, verify full access to all logs and settings.
