import * as q from './queries'
import { db } from '../../database'
import { DONT_EXISTS_ERROR, NULL_DATABASE_ERROR } from '../../lib/throwable'
import * as Supplier from '../supplier'

export interface IBill {
  id: number | bigint
  supplierId: number | bigint | null
  supplierFirstName: string | null
  supplierMiddleName: string | null
  supplierLastName: string | null
  number: string | null
  cost: number
  date: number
  notes: string
  dollarRate: number
  currency: 'USD' | 'LBP'
  isPaid: boolean
  totalPaid: number
  updateDate: number | null
}

export interface IRawBill {
  id: number | bigint
  supplierId: number | bigint | null
  supplierFirstName: string | null
  supplierMiddleName: string | null
  supplierLastName: string | null
  number: string | null
  cost: number
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
  isPaid: 1 | 0 | null
  supplierId: number | null
  startDate: number | null
  endDate: number | null
}

export function all(params: Omit<IPaginateParams, 'page' | 'perPage' | 'query'>): IBill[] {
  if (!db) throw NULL_DATABASE_ERROR
  const rawBills = db.prepare(q.SELECT_ALL).all(params) as IRawBill[]
  return rawBills.map((bill) => ({
    ...bill,
    isPaid: bill.isPaid === 1
  }))
}

export function findById(id: number | bigint): IBill {
  if (!db) throw NULL_DATABASE_ERROR
  const bill = db.prepare(q.SELECT_BY_ID).get([id]) as IBill
  if (!bill.id) throw DONT_EXISTS_ERROR
  bill.isPaid = bill.isPaid ? true : false
  return bill
}

export function create(
  bill: Omit<IBill, 'id' | 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName'>
): IBill {
  if (!db) throw NULL_DATABASE_ERROR
  const insertId: number | bigint = db.prepare(q.INSERT).run(bill).lastInsertRowid
  const newBill: IBill = {
    ...bill,
    id: insertId,
    supplierFirstName: null,
    supplierMiddleName: null,
    supplierLastName: null
  }
  if (bill.supplierId) {
    const supplier = Supplier.findById(bill.supplierId)
    newBill.supplierFirstName = supplier.firstName
    newBill.supplierMiddleName = supplier.middleName
    newBill.supplierLastName = supplier.lastName
  }

  return newBill
}

export function update(
  bill: Omit<IBill, 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName'>
): boolean {
  if (!db) throw NULL_DATABASE_ERROR
  return db.prepare(q.UPDATE).run({ ...bill, updateDate: Date.now() }).changes > 0
}

export function paginate(params: IPaginateParams): IBill[] {
  if (!db) throw NULL_DATABASE_ERROR
  const rawBills = db
    .prepare(q.SELECT_PAGINATED)
    .all({ ...params, start: params.perPage * (params.page - 1) }) as IRawBill[]
  return rawBills.map((bill) => ({
    ...bill,
    isPaid: bill.isPaid === 1
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
