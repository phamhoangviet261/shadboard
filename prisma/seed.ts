/* eslint-disable @typescript-eslint/no-explicit-any */
import { collectionsData } from "../src/data/lensora/collections"
import { productsData } from "../src/data/lensora/products"

import { PrismaClient } from "../src/generated/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning up database...")
  // Using deleteMany in order of dependencies
  await prisma.product.deleteMany()
  await prisma.collection.deleteMany()

  console.log("Seeding collections...")
  for (const collection of collectionsData) {
    await prisma.collection.create({
      data: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        thumbnailUrl: collection.coverImage,
        status: collection.status,
        isFeatured: collection.isFeatured,
        createdAt: new Date(collection.createdAt),
        updatedAt: new Date(collection.updatedAt),
      },
    })
  }

  console.log("Seeding products...")
  for (const product of productsData) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        status: product.status,
        collectionId: product.collectionId,
        images: product.images as any,
        colors: product.colors as any,
        frameShape: product.frameShape,
        frameMaterial: product.frameMaterial,
        lensType: product.lensType,
        faceFit: product.faceFit,
        gender: product.gender,
        size: product.size,
        stockQuantity: product.stock,
        sku: product.sku,
        isFeatured: product.isFeatured,
        specs: product.specs as any,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      },
    })
  }

  console.log("Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
