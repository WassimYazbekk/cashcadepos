import * as q from './queries'
import { db } from '../../database'
import { DONT_EXISTS_ERROR, NULL_DATABASE_ERROR } from '../../lib/throwable'
import * as Category from '../category'

export interface IProduct {
  id: number | bigint
  categoryId: number | bigint | null
  category: string
  name: string
  price: number
  remainingQuantity: number
  image: string
  currency: 'USD' | 'LBP'
  isViewable: boolean
}

export interface IRawProduct {
  id: number | bigint
  categoryId: number | bigint | null
  category: string
  name: string
  price: number
  remainingQuantity: number
  image: string
  currency: 'USD' | 'LBP'
  isViewable: 0 | 1
}

export interface IPaginateParams {
  page: number
  perPage: number
  query: string
  categoryId: number | bigint | null
  isViewable: boolean | null
}

export function all(params: Omit<IPaginateParams, 'page' | 'perPage' | 'query'>): IProduct[] {
  if (!db) throw NULL_DATABASE_ERROR
  const rawProducts = db.prepare(q.SELECT_ALL).all(params) as IRawProduct[]
  return rawProducts.map((product) => ({
    id: product.id,
    name: product.name,
    isViewable: product.isViewable === 1,
    image: product.image,
    categoryId: product.categoryId,
    category: product.category,
    price: product.price,
    remainingQuantity: product.remainingQuantity,
    currency: product.currency
  }))
}

export function findById(id: number | bigint): IProduct {
  if (!db) throw NULL_DATABASE_ERROR
  const product = db.prepare(q.SELECT_BY_ID).get([id]) as IProduct
  if (!product.id) throw DONT_EXISTS_ERROR
  product.isViewable = product.isViewable ? true : false
  return product
}

export function create(product: Omit<IProduct, 'id' | 'category' | 'remainingQuantity'>): IProduct {
  if (!db) throw NULL_DATABASE_ERROR
  const insertId: number | bigint = db.prepare(q.INSERT).run(product).lastInsertRowid
  const newProduct: IProduct = {
    ...product,
    id: insertId,
    remainingQuantity: 0,
    category: ''
  }
  if (product.categoryId) newProduct.category = Category.findById(product.categoryId).name
  return newProduct
}

export function update(product: Omit<IProduct, 'remainingQuantity'>): boolean {
  if (!db) throw NULL_DATABASE_ERROR
  return (
    db.prepare(q.UPDATE_BY_USER).run({ ...product, isViewable: product.isViewable ? 1 : 0 })
      .changes > 0
  )
}

export function updateQuantity(params: {
  productId: number | bigint
  quantityChange: number
}): void {
  if (!db) throw NULL_DATABASE_ERROR
  const product = findById(params.productId)
  const newQuantity = product.remainingQuantity + params.quantityChange
  db.prepare(q.UPDATE_QUANTITY).run({
    id: params.productId,
    remainingQuantity: newQuantity
  })
}

export function paginate(params: IPaginateParams): IProduct[] {
  if (!db) throw NULL_DATABASE_ERROR
  const rawProducts = db
    .prepare(q.SELECT_PAGINATED)
    .all({ ...params, start: params.perPage * (params.page - 1) }) as IRawProduct[]
  return rawProducts.map((product) => ({
    id: product.id,
    name: product.name,
    isViewable: product.isViewable === 1,
    image: product.image,
    categoryId: product.categoryId,
    category: product.category,
    price: product.price,
    remainingQuantity: product.remainingQuantity,
    currency: product.currency
  }))
}

export function count(params: Omit<IPaginateParams, 'page' | 'perPage'>): number {
  if (!db) throw NULL_DATABASE_ERROR
  const totalQuery = db.prepare(q.COUNT).all(params) as Array<{
    total: number
  }>
  const total = totalQuery[0].total
  return total
}
