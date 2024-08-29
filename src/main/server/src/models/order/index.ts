import * as q from './queries'
import { db } from '../..//database'
import { DONT_EXISTS_ERROR, NULL_DATABASE_ERROR } from '../../lib/throwable'
import * as Customer from '../customer'
import * as Product from '../product'

export interface IOrder {
  id: number | bigint
  customerId: number | bigint
  customerFirstName: string | null
  customerMiddleName: string | null
  customerLastName: string | null
  totalPrice: number
  date: number
  updateDate: number
  dollarRate: number
  currency: 'USD' | 'LBP'
  notes: string
  discount: number
  delivery: number
  products: IOrderProduct[]
  isPaid: boolean
  totalPaid: number
  type: 'SALE' | 'REFUND'
}

export interface IOrderProduct {
  id: number | bigint
  productId: number | bigint
  orderId: number | bigint
  pricePerItem: number
  quantity: number
  currency: 'USD' | 'LBP'
}

export interface IRawOrder {
  id: number | bigint
  customerId: number | bigint
  customerFirstName: string | null
  customerMiddleName: string | null
  customerLastName: string | null
  totalPrice: number
  date: number
  updateDate: number
  dollarRate: number
  currency: 'USD' | 'LBP'
  notes: string
  discount: number
  delivery: number
  products: IOrderProduct[]
  isPaid: 1 | 0
  totalPaid: number
  type: 'SALE' | 'REFUND'
}

export interface IPaginateParams {
  page: number
  perPage: number
  query: string
  customerId: number | bigint | null
  type: 'SALE' | 'REFUND' | null
  isPaid: boolean | null
  startDate: number | null
  endDate: number | null
}

export function all(
  params: Omit<IPaginateParams, 'page' | 'perPage' | 'query'>
): Omit<IOrder, 'products'>[] {
  if (!db) throw NULL_DATABASE_ERROR
  return db.prepare(q.SELECT_ALL).all(params) as Omit<IOrder, 'products'>[]
}

export function findById(id: number | bigint): IOrder {
  if (!db) throw NULL_DATABASE_ERROR
  const order = db.prepare(q.SELECT_BY_ID).get([id]) as Omit<IRawOrder, 'products'>
  if (!order.id) throw DONT_EXISTS_ERROR
  const products = db.prepare(q.SELECT_ORDER_PRODUCTS).all({ orderId: order.id }) as IOrderProduct[]
  return { ...order, isPaid: order.isPaid === 1, products: products }
}

export function create(
  order: Omit<IOrder, 'id' | 'customerFirstName' | 'customerMiddleName' | 'customerLastName'>
): IOrder {
  if (!db) throw NULL_DATABASE_ERROR
  const transaction = db.transaction(() => {
    if (!db) throw NULL_DATABASE_ERROR
    const insertId: number | bigint = db.prepare(q.INSERT).run(order).lastInsertRowid
    const updateQuantity = (productId: number | bigint, quantity: number) => {
      if (order.type === 'SALE') quantity = quantity * -1
      Product.updateQuantity({ productId: productId, quantityChange: quantity })
    }
    order.products.forEach((product) => {
      if (!db) throw NULL_DATABASE_ERROR
      db.prepare(q.INSERT_ORDER_PRODUCT).run({ ...product, orderId: insertId })
      updateQuantity(product.productId, product.quantity)
    })
    const newOrder: IOrder = {
      ...order,
      id: insertId,
      customerFirstName: null,
      customerMiddleName: null,
      customerLastName: null,
      products: order.products.map((product) => {
        return { ...product, orderId: insertId }
      })
    }
    if (order.customerId) {
      const { firstName, middleName, lastName } = Customer.findById(order.customerId)
      newOrder.customerFirstName = firstName
      newOrder.customerMiddleName = middleName
      newOrder.customerLastName = lastName
    }
    return newOrder
  })
  return transaction()
}

export function update(order: IOrder): boolean {
  if (!db) throw NULL_DATABASE_ERROR
  const transaction = db.transaction(() => {
    if (!db) throw NULL_DATABASE_ERROR
    const oldOrder = findById(order.id)
    const updateQuantity = (
      productId: number | bigint,
      quantity: number,
      type: 'SALE' | 'REFUND'
    ) => {
      if (type === 'SALE') quantity = quantity * -1
      Product.updateQuantity({ productId: productId, quantityChange: quantity })
    }
    oldOrder.products.forEach((product) => {
      updateQuantity(
        product.productId,
        product.quantity,
        oldOrder.type === 'SALE' ? 'REFUND' : 'SALE'
      )
    })
    db.prepare(q.DELETE_ORDER_PRODUCT).run({ orderId: oldOrder.id })
    order.products.forEach((product) => {
      if (!db) throw NULL_DATABASE_ERROR
      db.prepare(q.INSERT_ORDER_PRODUCT).run({ ...product, orderId: order.id })
      updateQuantity(product.productId, product.quantity, order.type)
    })

    return db.prepare(q.UPDATE).run(order).changes > 0
  })
  return transaction()
}

export function paginate(params: IPaginateParams): Omit<IOrder, 'products'>[] {
  if (!db) throw NULL_DATABASE_ERROR
  const orders = db
    .prepare(q.SELECT_PAGINATED)
    .all({ ...params, start: params.perPage * (params.page - 1) }) as Omit<IOrder, 'products'>[]
  return orders
}

export function count(params: Omit<IPaginateParams, 'page' | 'perPage'>): number {
  if (!db) throw NULL_DATABASE_ERROR
  const totalQuery = db.prepare(q.COUNT).all(params) as Array<{
    total: number
  }>
  const total = totalQuery[0].total
  return total
}
