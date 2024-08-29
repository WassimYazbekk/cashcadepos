import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SkeletonDataTable } from '@renderer/components/skeletons/common/skeleton-data-table'
import { DataTable } from '@renderer/components/common/data-table'
import { columns } from '@renderer/components/inventory/supplier/columns'

const Suppliers: React.FC = () => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, _setSearchQuery] = useState('')

  const setSearchQuery = (query: string) => {
    _setSearchQuery(query)
    setPage(1)
  }

  const fetchSuppliers = async (page: number, rows: number, query: string) => {
    try {
      const res = await http.get('supplier', {
        params: {
          page: page,
          perPage: rows,
          query: query
        }
      })
      const data = res.data
      return data
    } catch (error) {
      console.log(error)
    }
  }
  const suppliersQuery = useQuery({
    queryKey: ['suppliers', page, rowsPerPage, searchQuery],
    queryFn: () => fetchSuppliers(page, rowsPerPage, searchQuery),
    placeholderData: keepPreviousData
  })

  return (
    <div className="w-full h-[calc(100vh-119px)] ">
      <div className="h-full">
        {suppliersQuery.isLoading || suppliersQuery.isError ? (
          <SkeletonDataTable
            title={'suppliers_TABLE'}
            distructive={suppliersQuery.isError}
            keyId="supplier"
            hiddenColumns={{ id: false }}
            columns={columns}
          />
        ) : (
          <DataTable
            data={suppliersQuery.data.data}
            columns={columns}
            pagesCount={suppliersQuery.data.meta.totalPages}
            rowsPerPage={suppliersQuery.data.meta.perPage}
            setRowsPerPage={setRowsPerPage}
            hiddenColumns={{ id: false }}
            createRowLink="/inventory/supplier/add"
            query={searchQuery}
            title={'suppliers_TABLE'}
            totalRows={suppliersQuery.data.meta.total}
            setQuery={setSearchQuery}
            currentPage={suppliersQuery.data.meta.page}
            setPage={setPage}
          ></DataTable>
        )}
      </div>
    </div>
  )
}

export default Suppliers
