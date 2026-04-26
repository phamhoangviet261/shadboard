import { v2 as cloudinary } from "cloudinary"

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn("Cloudinary environment variables are missing.")
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

/**
 * Generates a signature for a signed upload to Cloudinary.
 * @param paramsToSign The parameters to be included in the signature.
 * @returns An object containing the signature and timestamp.
 */
export function generateSignature(
  paramsToSign: Record<string, string | number | boolean>
) {
  const timestamp = Math.round(new Date().getTime() / 1000)

  const signature = cloudinary.utils.api_sign_request(
    {
      ...paramsToSign,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET!
  )

  return { signature, timestamp }
}

/**
 * Gets the upload folder from environment variables or a default.
 */
export function getUploadFolder() {
  return process.env.CLOUDINARY_UPLOAD_FOLDER || "shadboard/products"
}
