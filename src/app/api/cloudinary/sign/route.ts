import { NextResponse } from "next/server"

import { authenticateUser, getAuthErrorResponse } from "@/lib/auth"
import { generateSignature, getUploadFolder } from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    // Authenticate user - only users with product:create/update permissions can sign uploads
    await authenticateUser(["product:create", "product:update"])

    const body = await request.json()
    const { folder = getUploadFolder(), tags = [] } = body

    // Base parameters for Cloudinary direct upload
    const paramsToSign = {
      folder,
      tags: tags.join(","),
    }

    const { signature, timestamp } = generateSignature(paramsToSign)

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      tags: paramsToSign.tags,
    })
  } catch (error) {
    console.error("Cloudinary signing error:", error)
    const authError = getAuthErrorResponse(error)
    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: authError.status }
      )
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
