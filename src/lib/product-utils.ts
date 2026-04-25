import { db } from "./prisma"

/**
 * Generates a unique slug by appending a suffix if needed
 */
export async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let uniqueSlug = baseSlug
  let counter = 1
  let isUnique = false

  while (!isUnique) {
    const existing = await db.product.findFirst({
      where: {
        slug: uniqueSlug,
        deletedAt: null,
      },
      select: { id: true },
    })

    if (!existing) {
      isUnique = true
    } else {
      counter++
      uniqueSlug = `${baseSlug}-${counter}`
    }
  }

  return uniqueSlug
}

/**
 * Generates a unique SKU by appending a suffix if needed
 */
export async function generateUniqueSku(baseSku: string): Promise<string> {
  let uniqueSku = baseSku
  let counter = 1
  let isUnique = false

  while (!isUnique) {
    const existing = await db.product.findFirst({
      where: {
        sku: uniqueSku,
        deletedAt: null,
      },
      select: { id: true },
    })

    if (!existing) {
      isUnique = true
    } else {
      counter++
      uniqueSku = `${baseSku}-COPY-${counter}`
    }
  }

  return uniqueSku
}
