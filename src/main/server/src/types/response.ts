export interface IErrorResponse {
  error: string
}

export interface ISingleItemResponse<T> {
  data: T
}

export interface IGetAllResponse<T> {
  data: T[]
}

export interface IPaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
