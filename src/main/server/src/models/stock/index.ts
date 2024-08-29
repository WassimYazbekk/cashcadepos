import * as q from './queries'
import { db } from '../../database'
import { DONT_EXISTS_ERROR, NULL_DATABASE_ERROR } from '../../lib/throwable'
import * as Product from '../product'
import * as Supplier from '../supplier'

export interface IStock {
  id: number | bigint
  productId: number | bigint
  productName: string | null
  supplierId: number | bigint | null
  supplierFirstName: string | null
  supplierMiddleName: string | null
  supplierLastName: string | null
  number: string
  cost: number
  quantity: number
  date: number
  notes: string
  dollarRate: number
  currency: 'USD' | 'LBP'
  isPaid: boolean
  totalPaid: number
  updateDate: number | null
}

export interface IRawStock {
  id: number | bigint
  productId: number | bigint
  productName: string | null
  supplierId: number | bigint | null
  supplierFirstName: string | null
  supplierMiddleName: string | null
  supplierLastName: string | null
  number: string
  cost: number
  quantity: number
  date: number
  notes: string
  dollarRate: number
  currency: 'USD' | 'LBP'
  isPaid: 0 | 1
  totalPaid: number
  updateDate: number | null
}

export interface IPaginateParams {
  page: number
  perPage: number
  query: string
  productId: number | null
  supplierId: number | null
  startDate: number | null
  endDate: number | null
}

export function all(params: Omit<IPaginateParams, 'page' | 'perPage' | 'query'>): IStock[] {
  if (!db) throw NULL_DATABASE_ERROR
  const rawStocks = db.prepare(q.SELECT_ALL).all(params) as IRawStock[]
  return rawStocks.map((stock) => ({
    ...stock,
    isPaid: stock.isPaid === 1
  }))
}

export function findById(id: number | bigint): IStock {
  if (!db) throw NULL_DATABASE_ERROR
  const stock = db.prepare(q.SELECT_BY_ID).get([id]) as IStock
  if (!stock.id) throw DONT_EXISTS_ERROR
  stock.isPaid = stock.isPaid ? true : false
  return stock
}

export function create(
  stock: Omit<
    IStock,
    'id' | 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName' | 'productName'
  >
): IStock {
  if (!db) throw NULL_DATABASE_ERROR
  const transaction = db.transaction(() => {
    if (!db) throw NULL_DATABASE_ERROR
    const insertId: number | bigint = db.prepare(q.INSERT).run(stock).lastInsertRowid
    const newStock: IStock = {
      ...stock,
      id: insertId,
      supplierFirstName: null,
      supplierMiddleName: null,
      supplierLastName: null,
      productName: null
    }
    if (stock.productId) {
      newStock.productName = Product.findById(stock.productId).name
      Product.updateQuantity({ productId: stock.productId, quantityChange: stock.quantity })
    }
    if (stock.supplierId) {
      const supplier = Supplier.findById(stock.supplierId)
      newStock.supplierFirstName = supplier.firstName
      newStock.supplierMiddleName = supplier.middleName
      newStock.supplierLastName = supplier.lastName
    }

    return newStock
  })
  return transaction()
}

export function update(
  stock: Omit<
    IStock,
    'productName' | 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName'
  >
): boolean {
  if (!db) throw NULL_DATABASE_ERROR
  const transaction = db.transaction(() => {
    if (!db) throw NULL_DATABASE_ERROR
    const oldStock = findById(stock.id)
    if (stock.productId !== null && stock.productId === oldStock.productId) {
      const newQuantity = stock.quantity - oldStock.quantity
      Product.updateQuantity({ productId: stock.productId, quantityChange: newQuantity })
    }
    if (
      stock.productId !== null &&
      oldStock.productId !== null &&
      stock.productId !== oldStock.productId
    ) {
      Product.updateQuantity({
        productId: oldStock.productId,
        quantityChange: oldStock.quantity * -1
      })
      Product.updateQuantity({
        productId: stock.productId,
        quantityChange: stock.quantity
      })
    }
    if (stock.productId !== null && oldStock.productId === null)
      Product.updateQuantity({
        productId: stock.productId,
        quantityChange: stock.quantity
      })
    if (stock.productId === null && oldStock.productId !== null)
      Product.updateQuantity({
        productId: oldStock.productId,
        quantityChange: oldStock.quantity * -1
      })
    return db.prepare(q.UPDATE).run({ ...stock, updateDate: Date.now() }).changes > 0
  })
  return transaction()
}

export function paginate(params: IPaginateParams): IStock[] {
  if (!db) throw NULL_DATABASE_ERROR
  const rawStocks = db
    .prepare(q.SELECT_PAGINATED)
    .all({ ...params, start: params.perPage * (params.page - 1) }) as IRawStock[]
  return rawStocks.map((stock) => ({
    ...stock,
    isPaid: stock.isPaid === 1
  }))
}

export function count(params: Omit<IPaginateParams, 'page' | 'perPage'>): number {
  if (!db) throw NULL_DATABASE_ERROR
  const totalQuery = db.prepare(q.COUNT).all(params) as Array<{ total: number }>
  const total = totalQuery[0].total
  return total
}
