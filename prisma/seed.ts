/* eslint-disable @typescript-eslint/no-explicit-any */
import { collectionsData } from "../src/data/lensora/collections"
import { productsData } from "../src/data/lensora/products"

import { hashPassword } from "../src/lib/password"
import { db } from "../src/lib/prisma"

import { UserRole } from "../src/generated/client"

const TEST_USERS = [
  {
    email: "admin@vietpham.com",
    name: "Admin User",
    password: "Admin@123456",
    role: UserRole.ADMIN,
  },
  {
    email: "manager@vietpham.com",
    name: "Manager User",
    password: "Manager@123456",
    role: UserRole.MANAGER,
  },
  {
    email: "editor@vietpham.com",
    name: "Editor User",
    password: "Editor@123456",
    role: UserRole.EDITOR,
  },
  {
    email: "viewer@vietpham.com",
    name: "Viewer User",
    password: "Viewer@123456",
    role: UserRole.VIEWER,
  },
]

async function main() {
  // Safety guard: do not run in production
  if (process.env.NODE_ENV === "production") {
    console.error("Error: Seed script cannot be run in production environment.")
    process.exit(1)
  }

  console.log("Cleaning up database...")
  // Using deleteMany in order of dependencies
  await db.product.deleteMany()
  await db.collection.deleteMany()

  console.log("Seeding collections...")
  for (const collection of collectionsData) {
    await db.collection.create({
      data: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        thumbnailUrl: collection.thumbnailUrl,
        status: collection.status,
        isFeatured: collection.isFeatured,
      },
    })
  }

  console.log("Seeding products...")
  for (const product of productsData) {
    await db.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        sku: product.sku,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        currency: product.currency,
        status: product.status,
        stockQuantity: product.stockQuantity,
        thumbnailUrl: product.thumbnailUrl,
        brand: product.brand,
        tags: product.tags,
        isFeatured: product.isFeatured,
        collectionId: product.collectionId,
        colors: product.colors as any,
        frameShape: product.frameShape,
        frameMaterial: product.frameMaterial,
        lensType: product.lensType,
        faceFit: product.faceFit,
        gender: product.gender,
        size: product.size,
        specs: product.specs as any,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      },
    })
  }

  console.log("Seeding test users...")
  for (const user of TEST_USERS) {
    const hashedPassword = await hashPassword(user.password)
    await db.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
      create: {
        email: user.email,
        name: user.name,
        username: user.email.split("@")[0],
        password: hashedPassword,
        role: user.role,
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
    await db.$disconnect()
  })
