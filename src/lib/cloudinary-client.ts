/**
 * Represents the response from a Cloudinary direct upload.
 */
export interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  format: string
  width: number
  height: number
  bytes: number
  resource_type: string
  [key: string]: unknown
}

/**
 * Uploads a file directly to Cloudinary using a signed request.
 *
 * @param file The file object to upload.
 * @param onProgress Callback for upload progress tracking.
 * @returns A promise that resolves to the Cloudinary response.
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> {
  // 1. Get the signature and upload parameters from our backend
  const signResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags: ["product-image", file.type.replace("image/", "")],
    }),
  })

  if (!signResponse.ok) {
    const error = await signResponse.json()
    throw new Error(error.message || "Failed to get upload signature")
  }

  const { signature, timestamp, apiKey, cloudName, folder, tags } =
    await signResponse.json()

  // 2. Perform the direct upload to Cloudinary
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", apiKey)
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)
    formData.append("folder", folder)
    formData.append("tags", tags)

    const xhr = new XMLHttpRequest()

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      true
    )

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        } catch (_e) {
          reject(new Error("Failed to parse Cloudinary response"))
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          reject(new Error(errorResponse.error?.message || "Upload failed"))
        } catch (_e) {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }
    }

    xhr.onerror = () => reject(new Error("Network error during upload"))

    xhr.send(formData)
  })
}
