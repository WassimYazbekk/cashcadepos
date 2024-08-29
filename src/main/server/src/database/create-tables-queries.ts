// This was used in db version 1 and 2.
// removed in db version 3.
const CREATE_NAME_TABLE = `
    CREATE TABLE IF NOT EXISTS name (
        id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        middle_name TEXT,
        last_name TEXT NOT NULL
    );
`

const CREATE_CUSTOMER_TABLE = `
    CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY,
        name_id INTEGER NOT NULL,
        phone_number TEXT,
        FOREIGN KEY (name_id) REFERENCES name(id)
    );
`

const CREATE_PRODUCT_TABLE = `
    CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY,
        category_id INTEGER,
        name TEXT UNIQUE NOT NULL,
        price INTEGER NOT NULL,
        average_cost INTEGER,
        dollar_rate INTEGER,
        remaining_quantity INTEGER,
        image TEXT,
        currency TEXT NOT NULL CHECK (currency IN ('USD', 'LBP')),
        is_viewable INTEGER NOT NULL CHECK (is_viewable IN (0, 1)),
        description TEXT,
        FOREIGN KEY (category_id) REFERENCES category(id)
    );
`

const CREATE_CATEGORY_TABLE = `
    CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        is_viewable INTEGER NOT NULL CHECK (is_viewable IN (0, 1)),
        image TEXT
    );
`

const CREATE_ORDER_TABLE = `
    CREATE TABLE IF NOT EXISTS order_table (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        total_price INTEGER NOT NULL,
        total_cost INTEGER,
        date INTEGER NOT NULL,
        update_date INTEGER,
        dollar_rate INTEGER,
        currency TEXT NOT NULL CHECK (currency IN ('USD', 'LBP')),
        notes TEXT,
        discount INTEGER,
        delivery INTEGER,
        tip INTEGER,
        is_paid INTEGER NOT NULL CHECK (is_paid IN (0, 1)),
        total_paid INTEGER,
        type TEXT NOT NULL CHECK (type IN ('SALE', 'REFUND')),
        FOREIGN KEY (customer_id) REFERENCES customer(id)
    );
`

const CREATE_ORDER_PRODUCT_TABLE = `
    CREATE TABLE IF NOT EXISTS order_product (
        id INTEGER PRIMARY KEY,
        product_id INTEGER NOT NULL,
        order_id INTEGER NOT NULL,
        cost_per_item INTEGER,
        price_per_item INTEGER,
        quantity INTEGER,
        notes TEXT,
        currency TEXT NOT NULL CHECK (currency IN ('USD', 'LBP')),
        FOREIGN KEY (product_id) REFERENCES product(id),
        FOREIGN KEY (order_id) REFERENCES order_table(id)
    );
`

const CREATE_SUPPLIER_TABLE = `
    CREATE TABLE IF NOT EXISTS supplier (
        id INTEGER PRIMARY KEY,
        name_id INTEGER,
        phone_number TEXT,
        FOREIGN KEY (name_id) REFERENCES name(id)
    );
`

const CREATE_STOCK_MOVEMENT_TABLE = `
    CREATE TABLE IF NOT EXISTS stock_movement (
        id INTEGER PRIMARY KEY,
        product_id INTEGER NULL,
        supplier_id INTEGER NULL,
        number TEXT UNIQUE,
        cost INTEGER NOT NULL,
        quantity INTEGER,
        date INTEGER NOT NULL,
        notes TEXT,
        dollar_rate INTEGER,
        currency TEXT NOT NULL CHECK (currency IN ('USD', 'LBP')),
        is_paid INTEGER NOT NULL CHECK (is_paid IN (0, 1)),
        total_paid INTEGER,
        update_date INTEGER,
        FOREIGN KEY (product_id) REFERENCES product(id),
        FOREIGN KEY (supplier_id) REFERENCES supplier(id)
    );
`

const CREATE_BILL_TABLE = `
    CREATE TABLE IF NOT EXISTS bill (
        id INTEGER PRIMARY KEY,
        supplier_id INTEGER NULL,
        number TEXT UNIQUE,
        title TEXT,
        cost INTEGER NOT NULL,
        date INTEGER NOT NULL,
        notes TEXT,
        dollar_rate INTEGER,
        currency TEXT NOT NULL CHECK (currency IN ('USD', 'LBP')),
        is_paid INTEGER NOT NULL CHECK (is_paid IN (0, 1)),
        total_paid INTEGER,
        update_date INTEGER,
        FOREIGN KEY (supplier_id) REFERENCES supplier(id)
    );
`

const CREATE_INDICES = `
    CREATE INDEX IF NOT EXISTS idx_name_first ON name (first_name);
    CREATE INDEX IF NOT EXISTS idx_name_last ON name (last_name);
    CREATE INDEX IF NOT EXISTS idx_customer_name_id ON customer (name_id);
    CREATE INDEX IF NOT EXISTS idx_product_category_id ON product (category_id);
    CREATE INDEX IF NOT EXISTS idx_product_name ON product (name);
    CREATE INDEX IF NOT EXISTS idx_category_name ON category (name);
    CREATE INDEX IF NOT EXISTS idx_order_table_customer_id ON order_table (customer_id);
    CREATE INDEX IF NOT EXISTS idx_order_table_date ON order_table (date);
    CREATE INDEX IF NOT EXISTS idx_order_table_type ON order_table (type);
    CREATE INDEX IF NOT EXISTS idx_order_product_product_id ON order_product (product_id);
    CREATE INDEX IF NOT EXISTS idx_order_product_order_id ON order_product (order_id);
    CREATE INDEX IF NOT EXISTS idx_supplier_name_id ON supplier (name_id);
    CREATE INDEX IF NOT EXISTS idx_stock_movement_product_id ON stock_movement (product_id);
    CREATE INDEX IF NOT EXISTS idx_stock_movement_supplier_id ON stock_movement (supplier_id);
    CREATE INDEX IF NOT EXISTS idx_stock_movement_date ON stock_movement (date);
    CREATE INDEX IF NOT EXISTS idx_bill_supplier_id ON bill (supplier_id);
    CREATE INDEX IF NOT EXISTS idx_bill_date ON bill (date);
`

const createTablesQueries = [
  CREATE_NAME_TABLE,
  CREATE_CUSTOMER_TABLE,
  CREATE_PRODUCT_TABLE,
  CREATE_CATEGORY_TABLE,
  CREATE_ORDER_TABLE,
  CREATE_ORDER_PRODUCT_TABLE,
  CREATE_SUPPLIER_TABLE,
  CREATE_STOCK_MOVEMENT_TABLE,
  CREATE_BILL_TABLE,
  CREATE_INDICES
]

export default createTablesQueries
