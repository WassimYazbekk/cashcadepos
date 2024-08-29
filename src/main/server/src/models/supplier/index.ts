import * as q from './queries'
import { db } from '../..//database'
import { DONT_EXISTS_ERROR, NAME_EXISTS_ERROR, NULL_DATABASE_ERROR } from '../../lib/throwable'

export interface ISupplier {
  id: number | bigint
  firstName: string
  middleName: string | null
  lastName: string
  phoneNumber: string
}

export interface IPaginateParams {
  page: number
  perPage: number
  query: string
}

export function all(): ISupplier[] {
  if (!db) throw NULL_DATABASE_ERROR
  return db.prepare(q.SELECT_ALL).all() as ISupplier[]
}

export function findById(id: number | bigint): ISupplier {
  if (!db) throw NULL_DATABASE_ERROR
  const supplier = db.prepare(q.SELECT_BY_ID).get([id]) as ISupplier
  if (!supplier.id) throw DONT_EXISTS_ERROR
  return supplier
}

export function create(supplier: Omit<ISupplier, 'id'>): ISupplier {
  if (!db) throw NULL_DATABASE_ERROR
  const existingEntree = db.prepare(q.SELECT_BY_NAME).get(supplier) as ISupplier
  if (existingEntree && existingEntree.id) throw NAME_EXISTS_ERROR
  const insertId: number | bigint = db.prepare(q.INSERT).run(supplier).lastInsertRowid
  const newSupplier: ISupplier = { ...supplier, id: insertId }
  return newSupplier
}

export function update(supplier: ISupplier): boolean {
  if (!db) throw NULL_DATABASE_ERROR
  const existingEntree = db.prepare(q.SELECT_BY_NAME).get(supplier) as ISupplier
  if (existingEntree && existingEntree.id && existingEntree.id !== supplier.id)
    throw NAME_EXISTS_ERROR
  return db.prepare(q.UPDATE).run(supplier).changes > 0
}

export function paginate(params: IPaginateParams): ISupplier[] {
  if (!db) throw NULL_DATABASE_ERROR
  const suppliers = db
    .prepare(q.SELECT_PAGINATED)
    .all({ ...params, start: params.perPage * (params.page - 1) }) as ISupplier[]
  return suppliers
}

export function count(query: string): number {
  if (!db) throw NULL_DATABASE_ERROR
  const totalQuery = db.prepare(q.COUNT).all({ query: query }) as Array<{ total: number }>
  const total = totalQuery[0].total
  return total
}
