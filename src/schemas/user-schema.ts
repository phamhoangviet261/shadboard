import { UserRole } from "@/generated/client"
import { z } from "zod"

export const UserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  q: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.string().optional(),
  sortBy: z
    .enum([
      "name",
      "email",
      "role",
      "status",
      "createdAt",
      "updatedAt",
      "lastLoginAt",
    ])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const UserUpdateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
})

export const UserUpdateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "DISABLED"]),
})

export type UserQueryType = z.infer<typeof UserQuerySchema>
export type UserUpdateRoleType = z.infer<typeof UserUpdateRoleSchema>
export type UserUpdateStatusType = z.infer<typeof UserUpdateStatusSchema>
