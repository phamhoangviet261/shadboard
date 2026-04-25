# Collections API Documentation

Manage product collections in Lensora.

## Endpoints

### List Collections
`GET /api/collections`

Retrieve a list of collections with filters.

**Query Parameters:**
- `status` (string): filter by status (`draft`, `published`, `archived`).
- `q` (string): search query.
- `includeProductCount` (boolean): if true, includes `_count` of products in each collection.
- `sortBy` (string): field to sort by (`name`, `sortOrder`, `createdAt`).
- `sortOrder` (string): sort direction (`asc`, `desc`).

**Example Request:**
`GET /api/collections?includeProductCount=true&sortBy=sortOrder`

---

### Get Collection Detail
`GET /api/collections/[id]`

Retrieve a single collection by ID or slug.

---

### Update Collection
`PATCH /api/collections/[id]`

Update collection fields.

---

### Delete Collection (Soft Delete)
`DELETE /api/collections/[id]`

Marks a collection as deleted.

---

## Error Responses
- Similar to Products API.
