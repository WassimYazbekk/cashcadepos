import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SkeletonDataTable } from '@renderer/components/skeletons/common/skeleton-data-table'
import { DataTable } from '@renderer/components/common/data-table'
import { columns } from '@renderer/components/inventory/stock/columns'
import SearchDropdown from '@renderer/components/common/search-dropdown'
import { DatePickerWithRange } from '@renderer/components/common/date-range-picker'
import BooleanFilter from '@renderer/components/inventory/boolean-filter'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardTitle } from '@renderer/components/ui/card'
import { formatNumberWithCommas } from '@renderer/lib/format-number-with-commas'

const ShowProduct: React.FC = () => {
  const productId = useParams().id
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPaid, setIsPaid] = useState<boolean | null>(null)
  const [supplierId, setSupplierId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState<number | null>(null)
  const [endDate, setEndDate] = useState<number | null>(null)

  useEffect(() => {
    setPage(1)
  }, [isPaid, supplierId, productId, startDate, endDate, searchQuery])

  const fetchStocks = async (
    page: number,
    rows: number,
    query: string,
    isPaid: boolean | null,
    supplierId: number | null,
    productId: number | null,
    startDate: number | null,
    endDate: number | null
  ) => {
    try {
      const res = await http.get('stock', {
        params: {
          page: page,
          perPage: rows,
          query: query,
          isPaid: isPaid,
          supplierId: supplierId,
          productId: productId,
          startDate: startDate,
          endDate: endDate
        }
      })
      const data = res.data
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const stocksQuery = useQuery({
    queryKey: [
      'stocks',
      page,
      rowsPerPage,
      searchQuery,
      isPaid,
      supplierId,
      productId,
      startDate,
      endDate
    ],
    queryFn: () =>
      fetchStocks(
        page,
        rowsPerPage,
        searchQuery,
        isPaid,
        supplierId,
        productId ? Number(productId) : null,
        startDate,
        endDate
      ),
    placeholderData: keepPreviousData
  })

  const suppliersQuery = useQuery({
    queryKey: ['suppliers', 'all'],
    queryFn: async () => {
      const res = await http.get('supplier/all')
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await http.get('product/' + productId)
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="w-full h-[calc(100vh-119px)] ">
      <div className="h-full">
        {stocksQuery.isLoading || stocksQuery.isError ? (
          <SkeletonDataTable
            title="Stock Track"
            distructive={stocksQuery.isError}
            hiddenColumns={{
              supplierId: false,
              averageCost: false,
              id: false,
              productId: false,
              dollarRate: false,
              updateDate: false,
              notes: false,
              currency: false
            }}
            keyId="stock"
            columns={columns}
          />
        ) : (
          <DataTable
            data={stocksQuery.data.data}
            columns={columns}
            pagesCount={stocksQuery.data.meta.totalPages}
            rowsPerPage={stocksQuery.data.meta.perPage}
            setRowsPerPage={setRowsPerPage}
            createRowLink="/inventory/stock/add"
            query={searchQuery}
            title={
              productQuery.isLoading || productQuery.isError
                ? 'loading'
                : productQuery.data.data.name
            }
            hiddenColumns={{
              supplierId: false,
              averageCost: false,
              id: false,
              productId: false,
              updateDate: false,
              notes: false,
              dollarRate: false,
              currency: false
            }}
            totalRows={stocksQuery.data.meta.total}
            setQuery={setSearchQuery}
            currentPage={stocksQuery.data.meta.page}
            setPage={setPage}
          >
            <DatePickerWithRange
              startDate={startDate}
              className="w-[240px]"
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <BooleanFilter
              value={isPaid}
              setValue={setIsPaid}
              onTrue="Paid"
              onFalse="Not Paid"
              onNull="All"
              className="w-24"
            />
            <SearchDropdown
              value={supplierId}
              className="max-w-[180px] w-[180px] overflow-clip justify-start"
              title="All Suppliers"
              setValue={setSupplierId}
              data={suppliersQuery.data.data}
              valueKey={['firstName', 'middleName', 'lastName']}
            />
          </DataTable>
        )}
      </div>
    </div>
  )
}

export default ShowProduct
