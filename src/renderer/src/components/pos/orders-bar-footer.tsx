import { BikeIcon, Percent } from 'lucide-react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import CurrencyInput from 'react-currency-input-field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useOrdersContext } from '@renderer/contexts/orders-context'
import { formatNumberWithCommas } from '@renderer/lib/format-number-with-commas'
import { useSettingnsContext } from '@renderer/contexts/settings-context'

const OrdersBarFooter: React.FC = () => {
  const { currentOrderId, setDiscount, orders, setOrderCurrency } = useOrdersContext()
  const { appSettings } = useSettingnsContext()
  const order = currentOrderId && orders ? orders.find((o) => o.id === currentOrderId) : null
  return (
    <div className="flex flex-col p-2 border-t">
      <div className="flex items items-center justify-between border-b pb-2">
        <h1 className="text-xl">Actions:</h1>
        <div className="flex items-center gap-2">
          <Button>
            <BikeIcon />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={order && order.discount > 0 ? 'default' : 'outline'}>
                <Percent />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <h1 className="mb-2">Discount</h1>
                <CurrencyInput
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  prefix={'$'}
                  placeholder="Discount"
                  value={order && order.discount > 0 ? order.discount : undefined}
                  onValueChange={(value) => {
                    setDiscount(value)
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
          <div className="w-24">
            <Select
              value={order ? order.currency : appSettings.defaultCurrency}
              onValueChange={(value: 'USD' | 'LBP') => {
                setOrderCurrency(value)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="LBP">LBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-3">
        <h1 className="text-lg py-2 flex">
          <span className="font-medium text-xl flex-1">Subtotal: </span>
          <span className="flex-1">{formatNumberWithCommas(1000000)}</span>
        </h1>
        <h1 className="text-lg py-2 flex">
          <span className="font-medium text-xl flex-1">Discount: </span>
          <span className="flex-1">{formatNumberWithCommas(1000000)}</span>
        </h1>
        <h1 className="text-lg py-2 flex">
          <span className="font-medium text-xl flex-1">Delivery: </span>
          <span className="flex-1">{formatNumberWithCommas(1000000)}</span>
        </h1>
        <h1 className="text-lg py-2 flex font-bold">
          <span className=" text-xl flex-1">Total: </span>
          <span className="flex-1">{formatNumberWithCommas(1000000)}</span>
        </h1>
      </div>
    </div>
  )
}

export default OrdersBarFooter
