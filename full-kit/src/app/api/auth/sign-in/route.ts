import { NextResponse } from "next/server"

import { authenticateCredentials } from "@/lib/authenticate-credentials"
import { SignInSchema } from "@/schemas/sign-in-schema"

export const runtime = "nodejs"

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

  const parsedData = SignInSchema.safeParse(body)

  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, { status: 400 })
  }

  const { email, password } = parsedData.data

  try {
    const user = await authenticateCredentials({ email, password })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Error signing in:", error)

    return NextResponse.json(
      { message: "Unable to sign in." },
      { status: 500 }
    )
  }
}
