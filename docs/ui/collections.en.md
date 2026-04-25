# Collection Management UI

The Collection Management module allows administrators to curate and organize products into storefront themes.

## Features

### Collection List
- **Real-time Overview**: Lists all collections with their cover imagery and publishing status.
- **Product Counts**: Automatically shows the number of active products assigned to each collection.
- **Search**: Fast filtering of collections by name or slug.
- **Actions**: Direct links to edit collections or view them on the storefront.

### Manage Collections (Sheet)
- **Inline Editing**: Create and edit collections within a slide-out sheet for a faster workflow.
- **Form Validation**: Strict validation for required fields like Name and Slug.
- **Imagery**: Support for setting collection cover images via URLs.
- **Status Management**: Control visibility with Draft, Published, and Archived states.

## Components

- `CollectionManager`: The main dashboard component handling the list and the management sheet.

## API Integration

- `GET /api/collections`: Fetch all active collections with product counts.
- `POST /api/collections`: Create a new collection.
- `PATCH /api/collections/[id]`: Update collection details or status.
- `DELETE /api/collections/[id]`: Soft delete a collection.
