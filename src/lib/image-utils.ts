/**
 * Validates if a string is a valid image URL (remote or absolute path).
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false

  // Allow absolute local paths
  if (url.startsWith("/")) return true

  try {
    const parsedUrl = new URL(url)
    // Check for common image extensions in the pathname
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".avif",
      ".svg",
    ]
    const hasImageExtension = imageExtensions.some((ext) =>
      parsedUrl.pathname.toLowerCase().endsWith(ext)
    )

    // Also consider it valid if it's a blob/base64 (though we might handle these separately)
    const isBlob = url.startsWith("blob:")
    const isDataUri = url.startsWith("data:image/")

    return (
      hasImageExtension ||
      isBlob ||
      isDataUri ||
      parsedUrl.protocol === "https:"
    )
  } catch {
    return false
  }
}

/**
 * Validates a File object for type and size.
 */
export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ]

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported. Use JPG, PNG, WebP, GIF, or AVIF.`,
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large (${formatFileSize(file.size)}). Max size is 5MB.`,
    }
  }

  return { valid: true }
}

/**
 * Formats bytes into a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Checks if a URL is a local blob URL.
 */
export function isLocalPreview(url: string): boolean {
  return url.startsWith("blob:")
}

/**
 * Revokes an object URL to prevent memory leaks.
 */
export function revokeImagePreviewUrl(url: string): void {
  if (isLocalPreview(url)) {
    URL.revokeObjectURL(url)
  }
}
