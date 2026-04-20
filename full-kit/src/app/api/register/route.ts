import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { db } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { RegisterSchema } from "@/schemas/register-schema"

export const runtime = "nodejs"

const defaultUserPreferences = {
  theme: "zinc",
  mode: "system",
  radius: "0.5",
  layout: "vertical",
  direction: "ltr",
} as const

function createFieldIssue(field: "username" | "email", message: string) {
  return {
    path: [field],
    message,
  }
}

function createUniqueConstraintIssues(targets: string[] | undefined) {
  if (!targets?.length) {
    return {
      issues: [
        createFieldIssue("email", "Email or username is already in use."),
      ],
    }
  }

  return {
    issues: targets.flatMap((target) => {
      if (target === "email") {
        return [createFieldIssue("email", "Email is already in use.")]
      }

      if (target === "username") {
        return [createFieldIssue("username", "Username is already in use.")]
      }

      return []
    }),
  }
}

export async function POST(req: Request) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON request body." },
      { status: 400 }
    )
  }

  const parsedData = RegisterSchema.safeParse(body)

  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, { status: 400 })
  }

  const { firstName, lastName, username, email, password } = parsedData.data
  const name = `${firstName} ${lastName}`

  try {
    const existingUsers = await db.user.findMany({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        email: true,
        username: true,
      },
    })

    const issues = []

    if (existingUsers.some((user) => user.email === email)) {
      issues.push(createFieldIssue("email", "Email is already in use."))
    }

    if (existingUsers.some((user) => user.username === username)) {
      issues.push(createFieldIssue("username", "Username is already in use."))
    }

    if (issues.length > 0) {
      return NextResponse.json({ issues }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        preferences: {
          create: defaultUserPreferences,
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: "Register successful.",
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        createUniqueConstraintIssues(error.meta?.target as string[] | undefined),
        { status: 409 }
      )
    }

    console.error("Error registering user:", error)

    return NextResponse.json(
      { message: "Unable to register user." },
      { status: 500 }
    )
  }
}
