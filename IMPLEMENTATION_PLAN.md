# Lensora — Implementation Plan

## Background

The project (`shadboard`) is a Next.js 14+ app with App Router, TypeScript, Tailwind CSS, and shadcn/ui. It already has:
- Full i18n routing under `/[lang]/…` with `en`, `vi`, and `ar` locales
- Auth middleware that classifies routes as `guest`, `protected`, or `public`
- A dashboard layout (`(dashboard-layout)`) with sidebar navigation
- A rich set of UI primitives in `src/components/ui`
- Data files in `src/data/`
- Global types in `src/types.ts`

**Goal:** Layer the **Lensora** eyewear ecommerce experience on top of this foundation — both a public shop and an admin CMS — without touching unrelated parts of the app.

---

## User Review Required

> [!IMPORTANT]
> The shop and admin routes will be **public** by default (no auth required) for the MVP demo. Admin auth can be added later. Please confirm if you want the admin routes protected behind auth.

> [!IMPORTANT]
> Mock data will be used throughout (no database integration). All mock data lives in dedicated files under `src/data/lensora/`. Please confirm if you want Prisma/DB integration at any point.

> [!WARNING]
> The `navigations.ts` sidebar data will be updated to include Lensora admin links. This is an additive change and won't break existing nav items.

---

## Open Questions

> [!NOTE]
> 1. Should the `/[lang]/shop` page be the new homepage (replacing the current redirect), or exist alongside the current dashboard?
> 2. Do you want a public storefront header/navbar (separate from the dashboard sidebar) for the shop pages?
> 3. For the AI writer, should it call a real LLM API (e.g., Google Gemini via the existing `/api/ai/writing` route), or simulate with mock responses for now?

---

## Proposed Changes

### Phase 1 — Foundation (Types, Mock Data, Auth Routes)

#### [MODIFY] [types.ts](file:///Users/vietph/Desktop/me/shadboard/src/types.ts)
- Add `ProductType`, `CollectionType`, `ProductStatus`, `ColorVariant`, `ProductSpecs` types

#### [NEW] `src/data/lensora/products.ts`
- 12–15 realistic mock eyewear products with all required fields

#### [NEW] `src/data/lensora/collections.ts`
- 4–6 collections (e.g. "Summer Edit", "Classics", "Sport")

#### [MODIFY] [auth-routes.ts](file:///Users/vietph/Desktop/me/shadboard/src/configs/auth-routes.ts)
- Add `/shop` → `{ type: "public" }` and `/admin` → `{ type: "public" }` (or `protected` if confirmed)

---

### Phase 2 — Admin CMS Pages

All under `src/app/[lang]/(dashboard-layout)/admin/`

#### [NEW] `admin/products/page.tsx` + `_components/`
- Products data table with status badge, price, collection, image thumbnail
- Bulk actions, search, filter by status
- Uses existing `data-table` component from `src/components/ui/data-table`

#### [NEW] `admin/products/new/page.tsx` + `_components/`
- Full create product form
- Sections: Basic info, Pricing, Images, Variants/Colors, Frame Specs, SEO
- Uses `file-dropzone.tsx` for image upload with drag/reorder
- Draft/Published/Archived toggle

#### [NEW] `admin/products/[id]/edit/page.tsx`
- Reuses the same form component as `new`, pre-populated

#### [NEW] `admin/collections/page.tsx` + `_components/`
- Collections table with product count, slug, status
- Create/edit collection drawer

#### [NEW] `admin/ai-writer/page.tsx` + `_components/`
- Tabs: "Description Generator" / "SEO Generator"
- Input: product name + key specs → AI output
- Calls `/api/ai/writing` route (or mock response)

#### [MODIFY] [navigations.ts](file:///Users/vietph/Desktop/me/shadboard/src/data/navigations.ts)
- Add a new `"Lensora"` section with items:
  - Products (`/admin/products`, icon: `Glasses`)
  - Collections (`/admin/collections`, icon: `Layers`)
  - AI Writer (`/admin/ai-writer`, icon: `Sparkles`)

---

### Phase 3 — Public Shop Pages

All under `src/app/[lang]/(public)/shop/` using a **new public layout** with a storefront navbar.

#### [NEW] `(public)/shop/layout.tsx`
- Minimal storefront navbar: Logo, nav links (Shop, Collections), Cart icon placeholder
- No sidebar — completely separate from dashboard layout

#### [NEW] `(public)/shop/page.tsx` + `_components/`
- Hero section with featured collection imagery
- Featured products grid (4–6 products)
- "Shop by Collection" section

#### [NEW] `(public)/shop/collections/page.tsx` + `_components/`
- Collections hero grid
- Each collection card: cover image, name, product count

#### [NEW] `(public)/shop/collections/[slug]/page.tsx` + `_components/`
- Collection hero banner (large image + name + description)
- Product grid with filters sidebar:
  - Frame shape, Material, Gender, Price range, Color
- Sort dropdown: Price, Newest, Featured
- Search within collection

#### [NEW] `(public)/shop/products/[slug]/page.tsx` + `_components/`
- Image gallery (main + thumbnails, keyboard navigable)
- Product info: name, price, compareAtPrice (strikethrough), badge (New/Sale)
- Color swatch selector
- Size selector
- Frame specs accordion
- Fit guide section
- Add to cart button (UI only, no cart state)
- Related products row

#### [NEW] `src/components/lensora/` — Shared shop components
- `product-card.tsx` — Product grid card with quick-view hover
- `product-quick-view.tsx` — Sheet/dialog with mini product detail
- `collection-card.tsx` — Collection card
- `product-filters.tsx` — Client filter sidebar
- `product-sort.tsx` — Client sort dropdown
- `color-swatch.tsx` — Color variant selector
- `frame-specs.tsx` — Specs accordion
- `storefront-header.tsx` — Public navbar

---

## File Tree Summary

```
src/
├── data/
│   └── lensora/
│       ├── products.ts          [NEW]
│       └── collections.ts       [NEW]
├── components/
│   └── lensora/
│       ├── product-card.tsx     [NEW]
│       ├── product-quick-view.tsx [NEW]
│       ├── collection-card.tsx  [NEW]
│       ├── product-filters.tsx  [NEW]
│       ├── product-sort.tsx     [NEW]
│       ├── color-swatch.tsx     [NEW]
│       ├── frame-specs.tsx      [NEW]
│       └── storefront-header.tsx [NEW]
├── app/[lang]/
│   ├── (public)/
│   │   └── shop/
│   │       ├── layout.tsx       [NEW]
│   │       ├── page.tsx         [NEW]
│   │       ├── collections/
│   │       │   ├── page.tsx     [NEW]
│   │       │   └── [slug]/
│   │       │       └── page.tsx [NEW]
│   │       └── products/
│   │           └── [slug]/
│   │               └── page.tsx [NEW]
│   └── (dashboard-layout)/
│       └── admin/
│           ├── products/
│           │   ├── page.tsx     [NEW]
│           │   ├── new/
│           │   │   └── page.tsx [NEW]
│           │   └── [id]/
│           │       └── edit/
│           │           └── page.tsx [NEW]
│           ├── collections/
│           │   └── page.tsx     [NEW]
│           └── ai-writer/
│               └── page.tsx     [NEW]
```

---

## Execution Order

1. Types + Mock data (`src/types.ts`, `src/data/lensora/`)
2. Auth route registration (`auth-routes.ts`)
3. Shared Lensora components (`src/components/lensora/`)
4. Admin CMS pages (products table → product form → collections → AI writer)
5. Public shop pages (layout → shop home → collections → product detail)
6. Navigation update (`navigations.ts`)

---

## Verification Plan

### Manual Verification
- Navigate to `/en/admin/products` — see product table with real mock data
- Navigate to `/en/admin/products/new` — see multi-section form with image upload
- Navigate to `/en/admin/ai-writer` — see AI content generation UI
- Navigate to `/en/shop` — see storefront hero and product grid
- Navigate to `/en/shop/collections` — see collection grid
- Navigate to `/en/shop/collections/classics` — see filtered product grid
- Navigate to `/en/shop/products/[slug]` — see full product detail with gallery and specs
- Verify dark mode looks polished on all pages
- Verify mobile layout on all pages

### Code Quality
- All components are typed with TypeScript
- No hardcoded strings in UI components
- Server/client component boundary respected
