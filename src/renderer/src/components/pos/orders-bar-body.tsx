import { useOrdersContext } from '@renderer/contexts/orders-context'
import { formatNumberWithCommas } from '@renderer/lib/format-number-with-commas'
import { TProduct } from '@renderer/types/types'

const OrdersBarBody: React.FC<{ products: TProduct[] }> = ({ products }) => {
  const { currentOrderId, orders } = useOrdersContext()
  const order = currentOrderId && orders ? orders.find((o) => o.id === currentOrderId) : null
  return (
    <div className="flex flex-1 flex-col overflow-y-scroll border p-2 gap-2">
      {order?.products.map((product) => {
        return (
          <div className="p-2 border flex">
            <div className="flex flex-1 flex-col">
              <h1 className="text-lg capitalize">
                {products.find((p) => p.id === product.productId)?.name}
              </h1>
              <h1 className="text-lg capitalize">
                {formatNumberWithCommas(product.pricePerItem / 100)}
              </h1>
            </div>
            <div className="flex flex-1 items-center justify-center">
              {formatNumberWithCommas(product.quantity)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrdersBarBody
