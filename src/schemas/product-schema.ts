import { z } from "zod"

export const ProductStatusSchema = z.enum(["draft", "published", "archived"])

export const ProductImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
})

export const ColorVariantSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
})

export const ProductSpecsSchema = z.object({
  lensWidth: z.number().positive(),
  bridgeWidth: z.number().positive(),
  templeLength: z.number().positive(),
  totalWidth: z.number().positive(),
  weight: z.number().positive().optional(),
})

export const ProductCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().nonnegative("Price must be non-negative"),
  compareAtPrice: z.number().nonnegative().optional(),
  costPrice: z.number().nonnegative().optional(),
  currency: z.string().default("USD"),
  status: ProductStatusSchema.default("draft"),
  stockQuantity: z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(0),
  images: z.array(ProductImageSchema).optional(),
  thumbnailUrl: z.string().url().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  collectionId: z.string().min(1).optional().nullable(),

  // Eyewear specific
  colors: z.array(ColorVariantSchema).optional(),
  frameShape: z.string().optional(),
  frameMaterial: z.string().optional(),
  lensType: z.string().optional(),
  faceFit: z.string().optional(),
  gender: z.string().optional(),
  size: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  specs: ProductSpecsSchema.optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const ProductUpdateSchema = ProductCreateSchema.partial().extend({
  // Ensure slug/sku remain unique if provided
})

export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  q: z.string().optional(),
  status: ProductStatusSchema.optional(),
  collectionId: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  tags: z.string().optional(), // Comma separated
  sortBy: z
    .enum(["name", "price", "createdAt", "stockQuantity"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>
