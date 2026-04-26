const PRODUCT_DECIMAL_FIELDS = new Set(["price", "compareAtPrice", "costPrice"])

function serializeProductValue(key: string, value: unknown) {
  if (
    PRODUCT_DECIMAL_FIELDS.has(key) &&
    value !== null &&
    value !== undefined
  ) {
    return Number(value)
  }

  if (
    typeof value === "object" &&
    value !== null &&
    value.constructor?.name === "Decimal"
  ) {
    return Number(value)
  }

  return value
}

export function serializeProduct<T>(product: unknown): T {
  return JSON.parse(JSON.stringify(product, serializeProductValue)) as T
}

export function serializeProducts<T>(products: unknown[]): T[] {
  return serializeProduct<T[]>(products)
}
