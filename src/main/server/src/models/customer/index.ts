import * as q from './queries'
import { db } from '../..//database'
import { DONT_EXISTS_ERROR, NAME_EXISTS_ERROR, NULL_DATABASE_ERROR } from '../../lib/throwable'

export interface ICustomer {
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

export function all(): ICustomer[] {
  if (!db) throw NULL_DATABASE_ERROR
  return db.prepare(q.SELECT_ALL).all() as ICustomer[]
}

export function findById(id: number | bigint): ICustomer {
  if (!db) throw NULL_DATABASE_ERROR
  const customer = db.prepare(q.SELECT_BY_ID).get([id]) as ICustomer
  if (!customer.id) throw DONT_EXISTS_ERROR
  return customer
}

export function create(customer: Omit<ICustomer, 'id'>): ICustomer {
  if (!db) throw NULL_DATABASE_ERROR
  const existingEntree = db.prepare(q.SELECT_BY_NAME).get(customer) as ICustomer
  if (existingEntree && existingEntree.id) throw NAME_EXISTS_ERROR
  const insertId: number | bigint = db.prepare(q.INSERT).run(customer).lastInsertRowid
  const newCustomer: ICustomer = { ...customer, id: insertId }
  return newCustomer
}

export function update(customer: ICustomer): boolean {
  if (!db) throw NULL_DATABASE_ERROR
  const existingEntree = db.prepare(q.SELECT_BY_NAME).get(customer) as ICustomer
  if (existingEntree && existingEntree.id && existingEntree.id !== customer.id)
    throw NAME_EXISTS_ERROR
  return db.prepare(q.UPDATE).run(customer).changes > 0
}

export function paginate(params: IPaginateParams): ICustomer[] {
  if (!db) throw NULL_DATABASE_ERROR
  const customers = db
    .prepare(q.SELECT_PAGINATED)
    .all({ ...params, start: params.perPage * (params.page - 1) }) as ICustomer[]
  return customers
}

export function count(query: string): number {
  if (!db) throw NULL_DATABASE_ERROR
  const totalQuery = db.prepare(q.COUNT).all({ query: query }) as Array<{ total: number }>
  const total = totalQuery[0].total
  return total
}
