import type { i18n } from "@/configs/i18n"
import type { LucideIcon, icons } from "lucide-react"
import type { ComponentType, SVGAttributes } from "react"
import type { z } from "zod"
import type { radii, themes } from "./configs/themes"
import type { ComingSoonSchema } from "./schemas/coming-soon-schema"
import type { ForgotPasswordSchema } from "./schemas/forgot-passward-schema"
import type { NewPasswordSchema } from "./schemas/new-passward-schema"
import type { RegisterSchema } from "./schemas/register-schema"
import type { SignInSchema } from "./schemas/sign-in-schema"
import type { VerifyEmailSchema } from "./schemas/verify-email-schema"

export type LayoutType = "vertical" | "horizontal"

export type ModeType = "light" | "dark" | "system"

export type OrientationType = "vertical" | "horizontal"

export type DirectionType = "ltr" | "rtl"

export type LocaleType = (typeof i18n)["locales"][number]

export type ThemeType = keyof typeof themes

export type RadiusType = (typeof radii)[number]

export type SettingsType = {
  theme: ThemeType
  mode: ModeType
  radius: RadiusType
  layout: LayoutType
  locale: LocaleType
}

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never
  color?: string
}

export type IconType = ComponentType<IconProps> | LucideIcon

export type DynamicIconNameType = keyof typeof icons

export interface UserType {
  id: string
  firstName: string
  lastName: string
  name: string
  password: string
  username: string
  role: string
  avatar: string
  background: string
  status: string
  phoneNumber: string
  email: string
  state: string
  country: string
  address: string
  zipCode: string
  language: string
  timeZone: string
  currency: string
  organization: string
  twoFactorAuth: boolean
  loginAlerts: boolean
  accountReoveryOption?: "email" | "sms" | "codes"
  connections: number
  followers: number
}

export interface RouteType {
  type: "guest" | "public"
  exceptions?: string[]
}

export interface NotificationType {
  unreadCount: number
  notifications: Array<{
    id: string
    iconName: DynamicIconNameType
    content: string
    url: string
    date: Date
    isRead: boolean
  }>
}

export type FormatStyleType = "percent" | "duration" | "currency" | "regular"

export interface NavigationType {
  title: string
  items: NavigationRootItem[]
}

export type NavigationRootItem =
  | NavigationRootItemWithHrefType
  | NavigationRootItemWithItemsType

export interface NavigationRootItemBasicType {
  title: string
  label?: string
  iconName: DynamicIconNameType
}

export interface NavigationRootItemWithHrefType
  extends NavigationRootItemBasicType {
  href: string
  items?: never
}

export interface NavigationRootItemWithItemsType
  extends NavigationRootItemBasicType {
  items: (
    | NavigationNestedItemWithHrefType
    | NavigationNestedItemWithItemsType
  )[]
  href?: never
}

export interface NavigationNestedItemBasicType {
  title: string
  label?: string
}

export interface NavigationNestedItemWithHrefType
  extends NavigationNestedItemBasicType {
  href: string
  items?: never
}

export interface NavigationNestedItemWithItemsType
  extends NavigationNestedItemBasicType {
  items: (
    | NavigationNestedItemWithHrefType
    | NavigationNestedItemWithItemsType
  )[]
  href?: never
}

export type NavigationNestedItem =
  | NavigationNestedItemWithHrefType
  | NavigationNestedItemWithItemsType

export interface OAuthLinkType {
  href: string
  label: string
  icon: IconType
}

export interface FileType {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>

export type NewPasswordFormType = z.infer<typeof NewPasswordSchema>

export type RegisterFormType = z.infer<typeof RegisterSchema>

export type SignInFormType = z.infer<typeof SignInSchema>

export type VerifyEmailFormType = z.infer<typeof VerifyEmailSchema>

export type ComingSoonFormType = z.infer<typeof ComingSoonSchema>

// ─── Lensora Eyewear Types ───────────────────────────────────────────────────

export type ProductStatus = "draft" | "published" | "archived"
export type FrameShape = "round" | "square" | "rectangle" | "cat-eye" | "aviator" | "oval" | "geometric"
export type FrameMaterial = "acetate" | "titanium" | "stainless-steel" | "tr90" | "wood"
export type LensType = "single-vision" | "progressive" | "bifocal" | "blue-light" | "sunglasses"
export type FaceFit = "narrow" | "medium" | "wide"
export type Gender = "men" | "women" | "unisex"
export type ProductSize = "XS" | "S" | "M" | "L" | "XL"

export interface ColorVariant {
  name: string
  hex: string
}

export interface ProductSpecs {
  lensWidth: number // mm
  bridgeWidth: number // mm
  templeLength: number // mm
  totalWidth: number // mm
  weight?: number // g
}

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductType {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  sku: string | null
  price: number
  compareAtPrice: number | null
  costPrice: number | null
  currency: string
  status: ProductStatus
  stockQuantity: number
  lowStockThreshold: number
  images: ProductImage[] | null
  thumbnailUrl: string | null
  brand: string | null
  tags: string[]
  metadata: Record<string, any> | null
  
  // Eyewear specific
  colors: ColorVariant[] | null
  frameShape: FrameShape | null
  frameMaterial: FrameMaterial | null
  lensType: LensType | null
  faceFit: FaceFit | null
  gender: Gender | null
  size: ProductSize[]
  isFeatured: boolean
  specs: ProductSpecs | null
  seoTitle: string | null
  seoDescription: string | null
  
  collectionId: string | null
  collection?: Partial<CollectionType>
  
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CollectionType {
  id: string
  name: string
  slug: string
  description: string | null
  thumbnailUrl: string | null
  status: ProductStatus
  sortOrder: number
  isFeatured: boolean
  metadata: Record<string, any> | null
  
  products?: ProductType[]
  _count?: {
    products: number
  }
  
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationInfo
}
