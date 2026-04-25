/**
 * Standardized API client for Lensora
 */

export type ApiRequestOptions = RequestInit & {
  params?: Record<string, any>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json")
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || response.statusText || "An error occurred",
      data
    )
  }

  return data as T
}

export const api = {
  async get<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const { params, ...init } = options
    let fullUrl = url

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        fullUrl += `${url.includes("?") ? "&" : "?"}${queryString}`
      }
    }

    const response = await fetch(fullUrl, {
      method: "GET",
      ...init,
    })

    return handleResponse<T>(response)
  },

  async post<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })

    return handleResponse<T>(response)
  },

  async patch<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })

    return handleResponse<T>(response)
  },

  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      method: "DELETE",
      ...options,
    })

    return handleResponse<T>(response)
  },
}
