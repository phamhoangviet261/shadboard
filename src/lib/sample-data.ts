import type { ProductCreateInput } from "@/schemas/product-schema"

const EYEWEAR_NAMES = [
  "Classic Acetate Round",
  "Solaris Aviator",
  "Blue-Light Blockers Elite",
  "Titanium Geometric Frames",
  "Handcrafted Wood Wayfarer",
  "Vintage Cat-Eye",
  "Premium Minimalist Square",
  "Urban Explorer Rectangle",
  "Azure Breeze Sunglasses",
  "Amber Glow Progressives",
]

const BRANDS = ["Lensora", "Visionary", "Optic Flow", "Pure Sight"]
const TAGS = [
  "eyewear",
  "premium",
  "handcrafted",
  "unisex",
  "new-arrival",
  "polarized",
]
const FRAME_SHAPES = [
  "round",
  "square",
  "rectangle",
  "cat-eye",
  "aviator",
  "oval",
  "geometric",
]
const FRAME_MATERIALS = [
  "acetate",
  "titanium",
  "stainless-steel",
  "tr90",
  "wood",
]
const LENS_TYPES = [
  "single-vision",
  "progressive",
  "bifocal",
  "blue-light",
  "sunglasses",
]
const FACE_FITS = ["narrow", "medium", "wide"]
const GENDERS = ["men", "women", "unisex"]

export function generateSampleProductData(): Partial<ProductCreateInput> {
  const name = EYEWEAR_NAMES[Math.floor(Math.random() * EYEWEAR_NAMES.length)]
  const price = Math.floor(Math.random() * 200) + 50
  const compareAtPrice =
    Math.random() > 0.5
      ? price + Math.floor(Math.random() * 50) + 20
      : undefined
  const costPrice = Math.floor(price * 0.4)

  return {
    name,
    description: `Experience unparalleled comfort and style with our ${name}. These frames are meticulously handcrafted using premium materials, ensuring durability and a lightweight feel for all-day wear. Perfect for those who value both function and fashion.`,
    shortDescription: `Premium ${name} eyewear for modern style.`,
    sku: `LNS-${Math.floor(Math.random() * 9000) + 1000}`,
    price,
    compareAtPrice,
    costPrice,
    currency: "USD",
    status: "draft",
    stockQuantity: Math.floor(Math.random() * 100) + 10,
    lowStockThreshold: 5,
    brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
    tags: [TAGS[0], TAGS[Math.floor(Math.random() * (TAGS.length - 1)) + 1]],
    isFeatured: Math.random() > 0.8,

    // Eyewear specific
    frameShape: FRAME_SHAPES[Math.floor(Math.random() * FRAME_SHAPES.length)],
    frameMaterial:
      FRAME_MATERIALS[Math.floor(Math.random() * FRAME_MATERIALS.length)],
    lensType: LENS_TYPES[Math.floor(Math.random() * LENS_TYPES.length)],
    faceFit: FACE_FITS[Math.floor(Math.random() * FACE_FITS.length)],
    gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
    size: ["M"],
    specs: {
      lensWidth: 50 + Math.floor(Math.random() * 5),
      bridgeWidth: 18 + Math.floor(Math.random() * 4),
      templeLength: 140 + Math.floor(Math.random() * 10),
      totalWidth: 135 + Math.floor(Math.random() * 15),
      weight: 20 + Math.floor(Math.random() * 10),
    },
    colors: [
      { name: "Midnight Black", hex: "#111111" },
      { name: "Honey Tortoise", hex: "#8B5E3C" },
    ],
    seoTitle: `${name} | Premium Eyewear - Lensora`,
    seoDescription: `Shop the ${name} eyewear collection at Lensora. Handcrafted frames with premium lenses. Free shipping and returns.`,
  }
}
