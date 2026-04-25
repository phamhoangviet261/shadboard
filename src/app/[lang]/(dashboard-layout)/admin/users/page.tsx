import type { Prisma } from "@/generated/client"
import type { Metadata } from "next"

import { UserQuerySchema } from "@/schemas/user-schema"
import { authenticateUser } from "@/lib/auth"
import { db } from "@/lib/prisma"

import { UserManagementTable } from "@/app/[lang]/(dashboard-layout)/admin/users/_components/user-management-table"

export const metadata: Metadata = {
  title: "Users — Lensora Admin",
}

export default async function AdminUsersPage(props: {
  params: Promise<{ lang: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await authenticateUser("role:manage")

  const { lang } = await props.params
  const searchParams = await props.searchParams

  // Parse query params
  const query = UserQuerySchema.parse({
    page: searchParams.page,
    limit: searchParams.limit,
    q: searchParams.q,
    role: searchParams.role,
    status: searchParams.status,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
  })

  const skip = (query.page - 1) * query.limit

  // Build where clause
  const where: Prisma.UserWhereInput = {}

  if (query.q) {
    where.OR = [
      { name: { contains: query.q as string, mode: "insensitive" } },
      { email: { contains: query.q as string, mode: "insensitive" } },
    ]
  }

  if (query.role) {
    where.role = query.role
  }

  if (query.status) {
    where.status = query.status
  }

  // Fetch data
  const [total, users] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    }),
  ])

  // Serialize dates for client component
  const serializedUsers = JSON.parse(JSON.stringify(users))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage user roles, statuses, and monitor their recent activity.
          </p>
        </div>
      </div>

      <UserManagementTable
        users={serializedUsers}
        lang={lang}
        pagination={{
          total,
          page: query.page,
          limit: query.limit,
          totalPages: Math.ceil(total / query.limit),
        }}
      />
    </div>
  )
}
