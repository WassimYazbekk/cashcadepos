import { useOrdersContext } from '@renderer/contexts/orders-context'
import OrdersBarBody from './orders-bar-body'
import OrdersBarFooter from './orders-bar-footer'
import OrdersBarHeader from './orders-bar-header'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import http from '@renderer/lib/local-axios-client'

const OrdersBar: React.FC = () => {
  const { orders, currentOrderId, createOrder, setCurrentOrderId, setCustomerId } =
    useOrdersContext()
  const orderIds: number[] = orders.map((order) => {
    return order.id
  })
  const currentOrder = orders.find((order) => order.id === currentOrderId)

  const productsQuery = useQuery({
    queryKey: ['product', 'all', null],
    queryFn: async () => {
      const res = await http.get('product/all', {
        params: { isViewable: true, categoryId: null }
      })
      const data = await res.data
      return data
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className="h-full border-r flex flex-col w-full p-2">
      <OrdersBarHeader
        customerId={currentOrder?.customerId || null}
        setCustomerId={setCustomerId}
        orders={orderIds}
        currentOrderId={currentOrderId}
        createOrder={createOrder}
        setCurrentOrderId={setCurrentOrderId}
      />
      <OrdersBarBody
        products={productsQuery.isError || productsQuery.isLoading ? [] : productsQuery.data.data}
      />
      <OrdersBarFooter />
    </div>
  )
}
export default OrdersBar
