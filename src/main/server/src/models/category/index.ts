import * as q from './queries'
import { db } from '../../database'
import { DONT_EXISTS_ERROR, NULL_DATABASE_ERROR } from '../../lib/throwable'

export interface ICategory {
  id: number | bigint
  name: string
  isViewable: boolean
  image: string
}

export interface IRawCategory {
  id: number | bigint
  name: string
  isViewable: 1 | 0
  image: string
}

export interface IPaginateParams {
  page: number
  perPage: number
  query: string
  isViewable: boolean | null
}

export function all(isViewable: boolean | null): ICategory[] {
  if (!db) throw NULL_DATABASE_ERROR
  const rawCategories = db.prepare(q.SELECT_ALL).all({ isViewable: isViewable }) as IRawCategory[]
  return rawCategories.map((category) => ({
    id: category.id,
    name: category.name,
    isViewable: category.isViewable === 1,
    image: category.image
  }))
}

export function findById(id: number | bigint): ICategory {
  if (!db) throw NULL_DATABASE_ERROR
  const category = db.prepare(q.SELECT_BY_ID).get([id]) as ICategory
  if (!category.id) throw DONT_EXISTS_ERROR
  category.isViewable = category.isViewable ? true : false
  return category
}

export function create(category: Omit<ICategory, 'id'>): ICategory {
  if (!db) throw NULL_DATABASE_ERROR
  const insertId: number | bigint = db.prepare(q.INSERT).run(category).lastInsertRowid
  const newCategory: ICategory = { ...category, id: insertId }
  return newCategory
}

export function update(category: ICategory): boolean {
  if (!db) throw NULL_DATABASE_ERROR
  return db.prepare(q.UPDATE).run(category).changes > 0
}

export function paginate(params: IPaginateParams): ICategory[] {
  if (!db) throw NULL_DATABASE_ERROR
  console.log(params)

  const rawCategories = db.prepare(q.SELECT_PAGINATED).all({
    ...params,
    start: params.perPage * (params.page - 1)
  }) as IRawCategory[]
  return rawCategories.map((category) => ({
    id: category.id,
    name: category.name,
    isViewable: category.isViewable === 1,
    image: category.image
  }))
}

export function count(query: string, isViewable: boolean | null): number {
  if (!db) throw NULL_DATABASE_ERROR
  const totalQuery = db.prepare(q.COUNT).all({ query: query, isViewable: isViewable }) as Array<{
    total: number
  }>
  const total = totalQuery[0].total
  return total
}
