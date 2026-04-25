# Products API Documentation

Manage eyewear products in Lensora.

## Endpoints

### List Products
`GET /api/products`

Retrieve a paginated list of products with filters and sorting.

**Query Parameters:**
- `page` (number): Page number (default: 1).
- `limit` (number): Items per page (default: 10).
- `q` (string): Search query (matches name, slug, sku, description).
- `status` (string): filter by status (`draft`, `published`, `archived`).
- `collectionId` (uuid): filter by collection.
- `minPrice` (number): minimum price.
- `maxPrice` (number): maximum price.
- `tags` (string): comma-separated tags.
- `sortBy` (string): field to sort by (`name`, `price`, `createdAt`, `stockQuantity`).
- `sortOrder` (string): sort direction (`asc`, `desc`).

**Example Request:**
`GET /api/products?status=published&sortBy=price&sortOrder=desc`

**Example Response:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Solaris Round",
      "slug": "solaris-round",
      "price": 189.00,
      "status": "published",
      "collection": {
        "name": "Summer Edit",
        "slug": "summer-edit"
      },
      ...
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### Get Product Detail
`GET /api/products/[id]`

Retrieve a single product by ID or slug.

**Example Request:**
`GET /api/products/solaris-round`

---

### Update Product
`PATCH /api/products/[id]`

Update one or more fields of a product.

**Request Body:**
Partial product object.

**Example Request:**
`PATCH /api/products/[uuid]`
```json
{
  "price": 199.00,
  "status": "published"
}
```

---

### Delete Product (Soft Delete)
`DELETE /api/products/[id]`

Marks a product as deleted. It will no longer appear in standard list/detail queries.

---

## Error Responses

- `400 Bad Request`: Validation failed (e.g., invalid price, missing name).
- `404 Not Found`: Product not found or already deleted.
- `409 Conflict`: Unique constraint violation (e.g., slug already exists).
- `500 Internal Server Error`: Something went wrong on the server.

## Soft Delete Notes
Lensora uses soft delete for products and collections. Deleted records remain in the database with a `deletedAt` timestamp but are filtered out from all API responses by default.
