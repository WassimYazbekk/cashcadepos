import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SkeletonDataTable } from '@renderer/components/skeletons/common/skeleton-data-table'
import { DataTable } from '@renderer/components/common/data-table'
import { columns } from '@renderer/components/inventory/product/columns'
import BooleanFilter from '@renderer/components/inventory/boolean-filter'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const ShowCategory: React.FC = () => {
  const categoryId = useParams().id
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, _setSearchQuery] = useState('')
  const [isViewable, _setIsViewable] = useState<boolean | null>(null)
  const navigate = useNavigate()

  const setSearchQuery = (query: string) => {
    _setSearchQuery(query)
    setPage(1)
  }

  const setIsViewable = (value: boolean | null) => {
    _setIsViewable(value)
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
    queryFn: () =>
      fetchProducts(
        page,
        rowsPerPage,
        searchQuery,
        isViewable,
        categoryId ? Number(categoryId) : null
      ),
    placeholderData: keepPreviousData
  })

  const categoryQuery = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const res = await http.get('category/' + categoryId, { params: { isViewable: null } })
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="w-full h-[calc(100vh-119px)] relative ">
      <Button onClick={() => navigate(-1)} className=" absolute top-0 left-1" variant={'ghost'}>
        <ArrowLeft />
        Back
      </Button>
      <div className="h-full">
        {productsQuery.isLoading || productsQuery.isError ? (
          <SkeletonDataTable
            title="Products"
            distructive={productsQuery.isError}
            hiddenColumns={{
              categoryId: false,
              category: false,
              id: false,
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
            title={
              categoryQuery.isLoading || categoryQuery.isError
                ? 'Loading...'
                : categoryQuery.data.data.name
            }
            hiddenColumns={{
              categoryId: false,
              category: false,
              id: false,
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
          </DataTable>
        )}
      </div>
    </div>
  )
}

export default ShowCategory
