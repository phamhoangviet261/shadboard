import { PrismaAdapter } from "@auth/prisma-adapter"

import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"

import { SignInSchema } from "@/schemas/sign-in-schema"

import { authenticateCredentials } from "@/lib/authenticate-credentials"
import { db } from "@/lib/prisma"

import CredentialsProvider from "next-auth/providers/credentials"

type PrismaAdapterClient = Parameters<typeof PrismaAdapter>[0]

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      avatar: string | null
      status: string
      role: string
    }
  }

  interface User {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
    role: string
  }
}

// Configuration for NextAuth with custom adapters and providers
// NextAuth.js documentation: https://next-auth.js.org/getting-started/introduction
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database interaction
  // More info: https://next-auth.js.org/getting-started/adapter
  adapter: PrismaAdapter(db as unknown as PrismaAdapterClient) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      // Custom authorize function to validate user credentials
      async authorize(credentials) {
        if (!credentials) return null

        try {
          const parsedCredentials = SignInSchema.safeParse(credentials)

          if (!parsedCredentials.success) {
            throw new Error("Invalid email or password.")
          }

          const user = await authenticateCredentials(parsedCredentials.data)

          if (!user) {
            throw new Error("Invalid email or password.")
          }

          return user
        } catch (e: unknown) {
          throw new Error(
            e instanceof Error ? e.message : "An unknown error occurred."
          )
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT strategy for sessions
    maxAge: 30 * 24 * 60 * 60, // Set session expiration to 30 days
    // More info on session strategies: https://next-auth.js.org/getting-started/options#session
  },
  callbacks: {
    // Callback to add custom user properties to JWT
    // Learn more: https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.avatar = user.avatar
        token.email = user.email
        token.status = user.status
        token.role = user.role
      }

      return token
    },
    // Callback to include JWT properties in the session object
    // Learn more: https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.avatar = token.avatar
        session.user.email = token.email
        session.user.status = token.status
        session.user.role = token.role
      }

      return session
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.id) {
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
      }
    },
  },
}
