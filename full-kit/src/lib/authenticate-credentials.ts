import { verifyPassword } from "@/lib/password"
import { db } from "@/lib/prisma"

export type AuthenticatedUser = {
  id: string
  name: string
  email: string | null
  avatar: string | null
  status: string
}

export async function authenticateCredentials({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<AuthenticatedUser | null> {
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      password: true,
    },
  })

  if (!user?.password) return null

  const isPasswordValid = await verifyPassword(password, user.password)

  if (!isPasswordValid) return null

  const { password: _password, ...authenticatedUser } = user

  return authenticatedUser
}
