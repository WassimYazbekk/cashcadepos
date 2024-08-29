import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SkeletonDataTable } from '@renderer/components/skeletons/common/skeleton-data-table'
import { DataTable } from '@renderer/components/common/data-table'
import { columns } from '@renderer/components/inventory/category/columns'
import BooleanFilter from '@renderer/components/inventory/boolean-filter'

const Categories: React.FC = () => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, _setSearchQuery] = useState('')
  const [isViewable, _setIsViewable] = useState<boolean | null>(null)

  const setSearchQuery = (query: string) => {
    _setSearchQuery(query)
    setPage(1)
  }

  const setIsViewable = (value: boolean | null) => {
    _setIsViewable(value)
    setPage(1)
  }

  const fetchCategories = async (
    page: number,
    rows: number,
    query: string,
    isViewable: boolean | null
  ) => {
    try {
      const res = await http.get('category', {
        params: {
          page: page,
          perPage: rows,
          query: query,
          isViewable: isViewable
        }
      })
      const data = res.data
      return data
    } catch (error) {
      console.log(error)
    }
  }
  const categoriesQuery = useQuery({
    queryKey: ['categories', page, rowsPerPage, searchQuery, isViewable],
    queryFn: () => fetchCategories(page, rowsPerPage, searchQuery, isViewable),
    placeholderData: keepPreviousData
  })

  return (
    <div className="w-full h-[calc(100vh-119px)] ">
      <div className="h-full">
        {categoriesQuery.isLoading || categoriesQuery.isError ? (
          <SkeletonDataTable
            title={'CATEGORIES_TABLE'}
            distructive={categoriesQuery.isError}
            keyId="category"
            hiddenColumns={{ id: false }}
            columns={columns}
          />
        ) : (
          <DataTable
            data={categoriesQuery.data.data}
            columns={columns}
            hiddenColumns={{ id: false }}
            pagesCount={categoriesQuery.data.meta.totalPages}
            rowsPerPage={categoriesQuery.data.meta.perPage}
            setRowsPerPage={setRowsPerPage}
            createRowLink="/inventory/category/add"
            query={searchQuery}
            title={'CATEGORIES_TABLE'}
            totalRows={categoriesQuery.data.meta.total}
            setQuery={setSearchQuery}
            currentPage={categoriesQuery.data.meta.page}
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
          </DataTable>
        )}
      </div>
    </div>
  )
}

export default Categories
