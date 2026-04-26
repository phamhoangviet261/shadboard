# Collections UI

## Special Routes

### /collections/all
The `/collections/all` route is a special virtual collection that displays all active products across the entire store.

- **Behavior**: It does not require a corresponding record in the `collections` table.
- **Filtering**: Supports all standard product filters and sorting.
- **SEO**: Automatically generates metadata with the title "All Products".

## Reserved Slugs

The following slugs are reserved and cannot be used when creating or editing collections:

- `all`: Reserved for the "All Products" virtual collection.

Manual verification steps for `all` slug:
1. Go to Admin > Collections.
2. Try to create a collection with slug `all`.
3. Verify that the system prevents saving and displays a validation error: "Slug 'all' is reserved".
