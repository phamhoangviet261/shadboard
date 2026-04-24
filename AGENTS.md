# AGENTS.md

## Project Direction

This project is being transformed into **Lensora**, an AI-powered eyewear store and CMS.

The goal is to build a polished ecommerce experience for glasses, including:

- Public collection pages
- Product detail pages
- Admin CMS for creating, editing, uploading, and managing eyewear products
- AI-assisted product description and SEO generation

## Coding Rules

- Use the existing project structure and conventions.
- Reuse existing UI components from `src/components/ui` whenever possible.
- Keep components small, typed, and reusable.
- Use TypeScript strictly.
- Keep product, collection, and CMS data typed.
- Avoid hardcoding product content directly inside UI components.
- Put mock data in dedicated data files.
- Prefer server components unless client interactivity is required.
- Use client components only for stateful UI like filters, dialogs, forms, upload preview, tabs, and command menus.
- Follow the existing Tailwind/shadcn styling style.
- Keep all UI responsive and dark-mode friendly.
- Add loading, empty, and error states where relevant.
- Do not use placeholder identity like John Doe.
- Do not rewrite unrelated parts of the app unless necessary.

## UI Direction

The visual style should feel like a premium eyewear brand:

- Clean luxury
- Minimal but polished
- Large product imagery
- Soft shadows
- Subtle borders
- Smooth hover states
- Elegant typography
- Neutral palette with strong contrast
- Mobile-first responsive layout

## Core Public Features

Build these public pages:

- `/[lang]/shop`
- `/[lang]/shop/collections`
- `/[lang]/shop/collections/[slug]`
- `/[lang]/shop/products/[slug]`

Public UI should include:

- Collection hero
- Product grid
- Filters
- Search
- Sorting
- Product quick view
- Product detail gallery
- Color variants
- Frame specs
- Fit guide
- Related products

## Core Admin Features

Build these admin/CMS pages:

- `/[lang]/admin/products`
- `/[lang]/admin/products/new`
- `/[lang]/admin/products/[id]/edit`
- `/[lang]/admin/collections`
- `/[lang]/admin/ai-writer`

Admin CMS should include:

- Product table
- Create/edit product form
- Image upload UI
- Drag/reorder image UI if possible
- Draft/published/archive status
- Product variants
- Product specs
- SEO fields
- Preview product page

## Eyewear Product Fields

A product should support:

- id
- name
- slug
- description
- price
- compareAtPrice
- status: draft | published | archived
- collectionId
- images
- colors
- frameShape
- frameMaterial
- lensType
- faceFit
- gender
- size
- stock
- sku
- isFeatured
- specs
- seoTitle
- seoDescription
- createdAt
- updatedAt

## AI Features

Start simple:

- AI product description generator
- AI SEO title/description generator

Future AI ideas:

- AI product tagging
- AI fit assistant
- AI collection curator

IMPORTANT:

- Do NOT run build commands automatically
- Do NOT execute npm/pnpm/yarn build unless explicitly asked
- Focus only on code changes
