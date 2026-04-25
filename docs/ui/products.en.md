# Product Management UI

The Product Management module provides a comprehensive interface for managing the Lensora eyewear catalog.

## Features

### Product List
- **Server-side Fetching**: Data is fetched directly from the database with support for pagination and filtering.
- **Search**: Debounced search by Name, Slug, or SKU.
- **Filters**: Filter products by Status (Draft, Published, Archived) and Collection.
- **Pagination**: Navigate through large catalogs with ease.
- **Actions**: Quick access to view details, edit, or delete products.

### Product Details
- **Comprehensive View**: Shows all product information including eyewear-specific specifications.
- **Pricing & Inventory**: Clear breakdown of price, compare-at price, cost, and stock levels.
- **Gallery**: Visual grid of all product images.
- **Organization**: Displays assigned collections, brands, and tags.

### Create/Edit Product
- **Form Validation**: Powered by `react-hook-form` and `zod` for strict type safety and user feedback.
- **Eyewear Specs**: Specialized fields for Frame Shape, Material, Lens Type, Face Fit, and Gender.
- **Measurements**: Precise entry for Lens, Bridge, Temple, and Total width.
- **Color Variants**: Dynamic addition and removal of color variants with color pickers.
- **SEO**: Integrated fields for SEO titles and descriptions.

## Components

- `ProductManagementTable`: The core list component with URL-synced filtering.
- `ProductForm`: The centralized form for both creation and editing.
- `ProductDetailsActions`: Client-side handlers for detail page interactions.
- `ProductDeleteDialog`: Confirmation dialog for safe product archival.

## API Integration

- `GET /api/products`: Listing with query parameters.
- `GET /api/products/[id]`: Single product retrieval.
- `POST /api/products`: Product creation.
- `PATCH /api/products/[id]`: Product updates.
- `DELETE /api/products/[id]`: Soft deletion (archiving).
