export interface PaginationParams {
  cursor?: string
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    hasMore: boolean
    nextCursor: string | null
    count: number
  }
}

export const getPaginationParams = (query: any): PaginationParams => {
  return {
    cursor: query.cursor as string | undefined,
    limit: query.limit ? Math.min(parseInt(query.limit), 100) : 20,
  }
}

export const buildPaginatedResponse = <T extends { id: string }>(
  items: T[],
  limit: number
): PaginatedResponse<T> => {
  const hasMore = items.length > limit
  const data = hasMore ? items.slice(0, limit) : items
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return {
    data,
    pagination: {
      hasMore,
      nextCursor,
      count: data.length,
    },
  }
}