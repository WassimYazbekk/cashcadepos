import { ReactFCWithChildren } from '@renderer/types/props'
import { TOrder, TOrderProduct } from '@renderer/types/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSettingnsContext } from './settings-context'

export type TOrdersStateContext = {
  orders: Omit<
    TOrder,
    | 'date'
    | 'updateDate'
    | 'isPaid'
    | 'customerFirstName'
    | 'customerMiddleName'
    | 'customerLastName'
  >[]
  currentOrderId: number | null
  createOrder: () => void
  setCurrentOrderId: (arg0: number) => void
  setCustomerId: (arg0: number | null) => void
  setDiscount: (arg0: string | undefined) => void
  setOrderCurrency: (arg0: 'USD' | 'LBP') => void
  addProduct: (arg0: TOrderProduct) => void
}

const StateContext = createContext<TOrdersStateContext>({
  orders: [],
  currentOrderId: null,
  createOrder: () => {},
  setCurrentOrderId: () => {},
  setCustomerId: () => {},
  setDiscount: () => {},
  setOrderCurrency: () => {},
  addProduct: () => {}
})

export const OrdersContextProvider: React.FC<ReactFCWithChildren> = ({ children }) => {
  const { dollarRate, defaultCurrency } = useSettingnsContext().appSettings
  const EMPTY_ORDER: Omit<
    TOrder,
    | 'date'
    | 'updateDate'
    | 'isPaid'
    | 'customerFirstName'
    | 'customerMiddleName'
    | 'customerLastName'
  > = {
    id: Date.now(),
    customerId: null,
    totalPrice: 0,
    dollarRate: dollarRate,
    currency: defaultCurrency,
    notes: '',
    discount: 0,
    delivery: 0,
    products: [],
    totalPaid: 0,
    type: 'SALE'
  }
  const [orders, _setOrders] = useState<
    Omit<
      TOrder,
      | 'date'
      | 'updateDate'
      | 'isPaid'
      | 'customerFirstName'
      | 'customerMiddleName'
      | 'customerLastName'
    >[]
  >([EMPTY_ORDER])

  const [currentOrderId, _setCurrentOrderId] = useState(0)

  function createOrder() {
    const newOrder = EMPTY_ORDER
    _setOrders((prev) => {
      let temp = prev
      temp.push(newOrder)
      return temp
    })
    _setCurrentOrderId(newOrder.id)
  }

  function setCurrentOrderId(id: number) {
    _setCurrentOrderId(id)
  }

  function setCustomerId(id: number | null) {
    const newOrders = orders
    newOrders[currentOrderId].customerId = id
    _setOrders(newOrders)
  }

  function setDiscount(value: string | undefined) {
    const newOrders = orders.map((o) => {
      if (o.id === currentOrderId) {
        o.discount = value ? Number(value) : 0
      }
      return o
    })
    _setOrders(newOrders)
  }

  function setOrderCurrency(value: 'USD' | 'LBP') {
    const newOrders = orders.map((o) => {
      if (o.id === currentOrderId) {
        o.currency = value
      }
      return o
    })
    _setOrders(newOrders)
  }

  function addProduct(product: TOrderProduct) {
    const newOrders = orders.map((o) => {
      if (o.id === currentOrderId) {
        const oldProduct = o.products.find((p) => p.productId === product.productId)
        if (oldProduct) oldProduct.quantity += 1
        else {
          o.products = [...o.products, product]
        }
      }
      return o
    })
    _setOrders(newOrders)
  }

  useEffect(() => {
    const getSettingsData = () => {
      try {
        const _orders = localStorage.getItem('ORDERS_DATA')
        if (_orders) _setOrders(JSON.parse(_orders))
        _setCurrentOrderId(orders[0].id)
      } catch (error) {
        console.log(error)
      }
    }

    getSettingsData()
  }, [])

  return (
    <StateContext.Provider
      value={{
        orders: orders,
        setDiscount: setDiscount,
        currentOrderId: currentOrderId,
        createOrder: createOrder,
        setCurrentOrderId: setCurrentOrderId,
        setCustomerId: setCustomerId,
        setOrderCurrency: setOrderCurrency,
        addProduct: addProduct
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useOrdersContext = () => useContext(StateContext)
