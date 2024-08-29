import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SkeletonDataTable } from '@renderer/components/skeletons/common/skeleton-data-table'
import { DataTable } from '@renderer/components/common/data-table'
import { columns } from '@renderer/components/inventory/product/columns'
import SearchDropdown from '@renderer/components/common/search-dropdown'
import BooleanFilter from '@renderer/components/inventory/boolean-filter'

const Products: React.FC = () => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, _setSearchQuery] = useState('')
  const [isViewable, _setIsViewable] = useState<boolean | null>(null)
  const [categoryId, _setCategoryId] = useState<number | null>(null)

  const setSearchQuery = (query: string) => {
    _setSearchQuery(query)
    setPage(1)
  }

  const setIsViewable = (value: boolean | null) => {
    _setIsViewable(value)
    setPage(1)
  }

  const setCategoryId = (value: number | null) => {
    _setCategoryId(value)
    setPage(1)
  }

  const fetchProducts = async (
    page: number,
    rows: number,
    query: string,
    isViewable: boolean | null,
    categoryId: number | null
  ) => {
    try {
      const res = await http.get('product', {
        params: {
          page: page,
          perPage: rows,
          query: query,
          isViewable: isViewable,
          categoryId: categoryId
        }
      })
      const data = res.data
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const productsQuery = useQuery({
    queryKey: ['products', page, rowsPerPage, searchQuery, isViewable, categoryId],
    queryFn: () => fetchProducts(page, rowsPerPage, searchQuery, isViewable, categoryId),
    placeholderData: keepPreviousData
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const res = await http.get('category/all', { params: { isViewable: null } })
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="w-full h-[calc(100vh-119px)] ">
      <div className="h-full">
        {productsQuery.isLoading || productsQuery.isError ? (
          <SkeletonDataTable
            title="Products Table"
            distructive={productsQuery.isError}
            hiddenColumns={{
              categoryId: false,
              averageCost: false,
              id: false,
              dollarRate: false,
              currency: false
            }}
            keyId="product"
            columns={columns}
          />
        ) : (
          <DataTable
            data={productsQuery.data.data}
            columns={columns}
            pagesCount={productsQuery.data.meta.totalPages}
            rowsPerPage={productsQuery.data.meta.perPage}
            setRowsPerPage={setRowsPerPage}
            createRowLink="/inventory/product/add"
            query={searchQuery}
            title="Products Table"
            hiddenColumns={{
              categoryId: false,
              averageCost: false,
              id: false,
              dollarRate: false,
              currency: false
            }}
            totalRows={productsQuery.data.meta.total}
            setQuery={setSearchQuery}
            currentPage={productsQuery.data.meta.page}
            setPage={setPage}
          >
            <BooleanFilter
              value={isViewable}
              setValue={setIsViewable}
              className="w-24"
              onTrue="Visible"
              onFalse="Hidden"
              onNull="All"
            />
            <SearchDropdown
              value={categoryId}
              title="All Categories"
              className="w-[160px] max-w-[160px] justify-start overflow-clip"
              setValue={setCategoryId}
              data={categoriesQuery.data.data}
              valueKey={['name']}
            />
          </DataTable>
        )}
      </div>
    </div>
  )
}

export default Products
