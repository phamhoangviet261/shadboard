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
