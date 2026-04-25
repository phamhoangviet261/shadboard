import type { CollectionType } from "@/types"

export const collectionsData: CollectionType[] = [
  {
    id: "col-001",
    name: "Summer Edit",
    slug: "summer-edit",
    description:
      "Bright, lightweight frames designed for long days under the sun. Vibrant hues and UV-protected lenses built for the season.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=80",
    status: "published",
    sortOrder: 0,
    isFeatured: true,
    metadata: {},
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "col-002",
    name: "Classics",
    slug: "classics",
    description:
      "Timeless silhouettes that never go out of style. Premium acetate and titanium frames crafted for everyday elegance.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&q=80",
    status: "published",
    sortOrder: 1,
    isFeatured: true,
    metadata: {},
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    deletedAt: null,
  },
]
