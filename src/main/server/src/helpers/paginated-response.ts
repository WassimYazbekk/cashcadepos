import { IPaginatedResponse } from '../types/response'

export default function paginatedResponse<T>(data: {
  data: T[]
  page: number
  perPage: number
  totalPages: number
  total: number
}): IPaginatedResponse<T> {
  return {
    data: data.data,
    meta: { total: data.total, perPage: data.perPage, totalPages: data.totalPages, page: data.page }
  }
}
