import { PlusIcon } from 'lucide-react'
import { Button } from '../ui/button'
import SearchDropdown from '../common/search-dropdown'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import http from '@renderer/lib/local-axios-client'

const OrdersBarHeader: React.FC<{
  orders: number[]
  currentOrderId: number | null
  createOrder: () => void
  setCurrentOrderId: (arg0: number) => void
  customerId: number | null
  setCustomerId: (arg0: number | null) => void
}> = ({ orders, currentOrderId, createOrder, setCurrentOrderId, customerId, setCustomerId }) => {
  const customersQuery = useQuery({
    queryKey: ['customers', 'all'],
    queryFn: async () => {
      const res = await http.get('customer/all')
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="flex flex-col w-full border-b">
      <div className="flex gap-2 overflow-x-scroll pb-2 mb-2">
        <div className="fixed bg-background">
          <Button onClick={createOrder} className="gap-1" variant={'ghost'}>
            <PlusIcon size={20} />
            Order
          </Button>
        </div>
        <div className="flex gap-1 pl-28 flex-1">
          {orders.map((orderId, idx) => {
            return (
              <Button
                onClick={() => setCurrentOrderId(orderId)}
                key={'order:' + orderId}
                variant={currentOrderId === orderId ? 'default' : 'outline'}
              >
                {idx + 1}
              </Button>
            )
          })}
        </div>
      </div>
      <div className="mb-2 flex gap-2">
        <Button className="gap-1" variant={'ghost'}>
          <PlusIcon size={20} />
          Customer
        </Button>
        <SearchDropdown
          value={customerId}
          className=" w-full overflow-clip justify-start"
          title="Select a Customer"
          setValue={setCustomerId}
          data={customersQuery.isLoading || customersQuery.isError ? [] : customersQuery.data.data}
          valueKey={['firstName', 'middleName', 'lastName']}
        />
      </div>
    </div>
  )
}
export default OrdersBarHeader
