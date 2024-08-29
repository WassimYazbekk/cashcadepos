import { ColumnDef, VisibilityState } from '@tanstack/react-table'
import { Dispatch, SetStateAction } from 'react'

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagesCount: number
  rowsPerPage: 10 | 20 | 30 | 40 | 50
  currentPage: number
  hiddenColumns?: VisibilityState
  title: string
  createRowLink?: string
  totalRows: number
  query: string
  children?: React.ReactNode
  setQuery: (query: string) => void
  setPage: Dispatch<SetStateAction<number>>
  setRowsPerPage: Dispatch<SetStateAction<number>>
}

export interface SkeletonDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  title: string
  hiddenColumns?: VisibilityState
  distructive?: boolean
  keyId: string
}

export type ReactFCWithChildren = {
  children: React.ReactNode
}
