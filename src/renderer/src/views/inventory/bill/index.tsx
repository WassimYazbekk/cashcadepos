import http from '@renderer/lib/local-axios-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SkeletonDataTable } from '@renderer/components/skeletons/common/skeleton-data-table'
import { DataTable } from '@renderer/components/common/data-table'
import { columns } from '@renderer/components/inventory/bill/columns'
import SearchDropdown from '@renderer/components/common/search-dropdown'
import { DatePickerWithRange } from '@renderer/components/common/date-range-picker'
import BooleanFilter from '@renderer/components/inventory/boolean-filter'

const Bills: React.FC = () => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPaid, setIsPaid] = useState<boolean | null>(null)
  const [supplierId, setSupplierId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState<number | null>(null)
  const [endDate, setEndDate] = useState<number | null>(null)

  useEffect(() => {
    setPage(1)
  }, [isPaid, supplierId, startDate, endDate, searchQuery])

  const fetchBills = async (
    page: number,
    rows: number,
    query: string,
    isPaid: boolean | null,
    supplierId: number | null,
    startDate: number | null,
    endDate: number | null
  ) => {
    try {
      const res = await http.get('bill', {
        params: {
          page: page,
          perPage: rows,
          query: query,
          isPaid: isPaid,
          supplierId: supplierId,
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

  const billsQuery = useQuery({
    queryKey: ['bills', page, rowsPerPage, searchQuery, isPaid, supplierId, startDate, endDate],
    queryFn: () =>
      fetchBills(page, rowsPerPage, searchQuery, isPaid, supplierId, startDate, endDate),
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

  return (
    <div className="w-full h-[calc(100vh-119px)] ">
      <div className="h-full">
        {billsQuery.isLoading || billsQuery.isError ? (
          <SkeletonDataTable
            title="Bills Table"
            distructive={billsQuery.isError}
            hiddenColumns={{
              supplierId: false,
              averageCost: false,
              id: false,
              dollarRate: false,
              currency: false
            }}
            keyId="bill"
            columns={columns}
          />
        ) : (
          <DataTable
            data={billsQuery.data.data}
            columns={columns}
            pagesCount={billsQuery.data.meta.totalPages}
            rowsPerPage={billsQuery.data.meta.perPage}
            setRowsPerPage={setRowsPerPage}
            createRowLink="/inventory/bill/add"
            query={searchQuery}
            title="Bills Table"
            hiddenColumns={{
              supplierId: false,
              averageCost: false,
              id: false,
              dollarRate: false,
              currency: false
            }}
            totalRows={billsQuery.data.meta.total}
            setQuery={setSearchQuery}
            currentPage={billsQuery.data.meta.page}
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

export default Bills
