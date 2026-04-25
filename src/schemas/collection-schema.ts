import { z } from "zod"

export const CollectionStatusSchema = z.enum(["draft", "published", "archived"])

export const CollectionCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  status: CollectionStatusSchema.default("draft"),
  sortOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
})

export const CollectionUpdateSchema = CollectionCreateSchema.partial()

export const CollectionQuerySchema = z.object({
  status: CollectionStatusSchema.optional(),
  q: z.string().optional(),
  includeProductCount: z.coerce.boolean().default(false),
  sortBy: z.enum(["name", "sortOrder", "createdAt"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export type CollectionCreateInput = z.infer<typeof CollectionCreateSchema>
export type CollectionUpdateInput = z.infer<typeof CollectionUpdateSchema>
export type CollectionQueryInput = z.infer<typeof CollectionQuerySchema>
