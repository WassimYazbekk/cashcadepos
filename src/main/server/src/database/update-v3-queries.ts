export const CREATE_NEW_CUSTOMER_TABLE = `
DROP TABLE IF EXISTS new_customer;
CREATE TABLE IF NOT EXISTS new_customer(
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  phone_number TEXT
);`

export const INSERT_CUSTOMER_WITH_ID = `
INSERT INTO new_customer
VALUES($id,$firstName,$middleName,$lastName,$phoneNumber);
`

export const RENAME_CUSTOMER_TABLE = `
DROP TABLE IF EXISTS customer;
ALTER TABLE new_customer RENAME TO customer
`

export const CREATE_NEW_SUPPLIER_TABLE = `
DROP TABLE IF EXISTS new_supplier;
CREATE TABLE IF NOT EXISTS new_supplier(
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  phone_number TEXT
);`

export const INSERT_SUPPLIER_WITH_ID = `
INSERT INTO new_supplier
VALUES($id,$firstName,$middleName,$lastName,$phoneNumber);
`

export const RENAME_SUPPLIER_TABLE = `
DROP TABLE IF EXISTS supplier;
ALTER TABLE new_supplier RENAME TO supplier
`

export const SELECT_ALL_CUSTOMERS_OLD = `
  SELECT c.id, c.name_id AS nameId, c.phone_number AS phoneNumber,
    n.first_name as firstName, n.middle_name as middleName, n.last_name as lastName
  FROM customer c
  INNER JOIN name n
  ON c.name_id = n.id;
`

export const SELECT_ALL_SUPPLIERS_OLD = `
  SELECT s.id, s.name_id AS nameId, s.phone_number AS phoneNumber,
    n.first_name as firstName, n.middle_name as middleName, n.last_name as lastName
  FROM supplier s
  INNER JOIN name n
  ON s.name_id = n.id;
`
