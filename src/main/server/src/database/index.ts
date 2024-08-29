import * as q from './update-v3-queries'
import Database from 'better-sqlite3'
import { join } from 'path'
import createTablesQueries from './create-tables-queries'
import { NULL_DATABASE_ERROR } from '../lib/throwable'

export let db: Database.Database | null = null

export function initializeDatabase(path: string, name: string) {
  try {
    db = new Database(join(path, name))
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = OFF;')
    const tablesCreated = createTables()
    const upToDate = updateDatabase()
    db.pragma('foreign_keys = ON;')
    if (tablesCreated && upToDate) return true
    return false
  } catch (err) {
    console.log(err)
    return false
  }
}

function createTables(): boolean {
  let success = false
  try {
    if (!db) throw NULL_DATABASE_ERROR
    if (getCurrentVersion() === 0) {
      const createTablesTransaction = db.transaction((queries) => {
        for (const query of queries) db!.exec(query)
      })
      createTablesTransaction(createTablesQueries)
      if (getCurrentVersion() === 0) {
        if (!db) throw NULL_DATABASE_ERROR
        db.pragma('user_version = 2;')
      }
    }
    success = true
  } catch (error) {
    console.log(error)
  } finally {
    return success
  }
}

export function closeDatabase() {
  if (!db) throw NULL_DATABASE_ERROR
  while (db.inTransaction) {}
  db.close()
}

function checkForUpdates(): boolean {
  if (getCurrentVersion() < Number(import.meta.env.MAIN_VITE_DATABASE_VERSION)) return true
  return false
}

function getCurrentVersion(): number {
  const userVersions = db!.pragma('user_version') as Array<{ user_version: number }>
  return userVersions[0].user_version
}

function updateDatabase(): boolean {
  if (!checkForUpdates()) return true
  const currentVersion = getCurrentVersion()
  if (currentVersion === 2) return updateToVersionThree()
  return true
}

function updateToVersionThree() {
  let success = false
  try {
    if (!db) throw NULL_DATABASE_ERROR
    db.exec(q.CREATE_NEW_CUSTOMER_TABLE)
    db.exec(q.CREATE_NEW_SUPPLIER_TABLE)
    const oldCustomers = db.prepare(q.SELECT_ALL_CUSTOMERS_OLD).all()
    const oldSuppliers = db.prepare(q.SELECT_ALL_SUPPLIERS_OLD).all()
    const createNewCustomerQuery = db.prepare(q.INSERT_CUSTOMER_WITH_ID)
    const createNewSupplierQuery = db.prepare(q.INSERT_SUPPLIER_WITH_ID)
    insertMany(oldCustomers, createNewCustomerQuery)
    insertMany(oldSuppliers, createNewSupplierQuery)
    const transaction = db.transaction(() => {
      if (!db) throw NULL_DATABASE_ERROR
      db.exec(q.RENAME_CUSTOMER_TABLE)
      db.exec(q.RENAME_SUPPLIER_TABLE)
      db.pragma('user_version = 3;')
      return true
    })
    success = transaction()
  } catch (error) {
    console.log(error)
  } finally {
    return success
  }
}

function insertMany<T>(data: Array<T>, query: Database.Statement) {
  if (!db) throw NULL_DATABASE_ERROR
  const transaction = db.transaction((data, query) => {
    for (const entree of data) query.run(entree)
  })
  return transaction(data, query)
}
