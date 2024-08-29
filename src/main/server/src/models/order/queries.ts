export const INSERT = `
  INSERT INTO order (customer_id, total_price, date, dollar_rate, currency, notes, discount, delivery, is_paid, total_paid, type)
  VALUES(customer_id, $total_price, $date, $dollar_rate, $currency, $notes, $discount, $delivery, $is_paid, $total_paid, $type);
`

export const SELECT_ALL = `
  SELECT o.id, o.customer_id AS customerId, o.total_price AS totalPrice, o.date, o.dollar_rate AS dollarRate, o.currency,
    o.notes, o.discount, o.delivery, o.is_paid AS isPaid, o.total_paid AS totalPaid, o.type, c.first_name as customerFirstName,
    c.middle_name AS customerMiddleName, c.last_name AS customerLastName
  FROM order o
  LEFT JOIN customer c
  ON o.customer_id = c.id;
`

export const SELECT_BY_ID = `
  SELECT o.id, o.customer_id AS customerId, o.total_price AS totalPrice, o.date, o.dollar_rate AS dollarRate, o.currency,
    o.notes, o.discount, o.delivery, o.is_paid AS isPaid, o.total_paid AS totalPaid, o.type, c.first_name as customerFirstName,
    c.middle_name AS customerMiddleName, c.last_name AS customerLastName
  FROM order o
  LEFT JOIN customer c
  ON o.customer_id = c.id
  WHERE o.id = ?;
`

export const COUNT = `
  SELECT COUNT(*) AS total
  FROM order
  WHERE (date > $startDate or $startDate IS NULL)
    AND (date < $endDate or $endDate IS NULL)
    AND (customer_id < $customerId or $customerId IS NULL)
    AND (type < $type or $type IS NULL)
    AND (is_paid < $isPaid or $isPaid IS NULL);
`

export const SELECT_PAGINATED = `
  SELECT o.id, o.customer_id AS customerId, o.total_price AS totalPrice, o.date, o.dollar_rate AS dollarRate, o.currency,
    o.notes, o.discount, o.delivery, o.is_paid AS isPaid, o.total_paid AS totalPaid, o.type, c.first_name as customerFirstName,
    c.middle_name AS customerMiddleName, c.last_name AS customerLastName
  FROM order o
  LEFT JOIN customer c
  ON o.customer_id = c.id
  WHERE (date > $startDate or $startDate IS NULL)
    AND (date < $endDate or $endDate IS NULL)
    AND (customer_id < $customerId or $customerId IS NULL)
    AND (type < $type or $type IS NULL)
    AND (is_paid < $isPaid or $isPaid IS NULL)
  ORDER BY o.id ASC
  LIMIT $perPage
  OFFSET $start;
`

export const UPDATE = `
  UPDATE order
  SET customer_id = $customerId,
    total_price = $totalPrice,
    date = $date,
    dollar_rate = $dollarRate,
    currency = $currency,
    notes = $notes,
    discount = $discount,
    delivery = $delivery,
    is_paid = $isPaid,
    total_paid = $totalPaid,
    type = $type,
    update_date = $updateDate
  WHERE id = $id;
`

export const INSERT_ORDER_PRODUCT = `
  INSERT INTO order_product (order_id, product_id, price_per_item, quantity)
  VALUES ($orderId, $productId, $pricePerItem, $quantity);
`

export const SELECT_ORDER_PRODUCTS = `
  SELECT order_id AS orderId, product_id AS productId, price_per_item AS price, quantity
  FROM order_product
  WHERE order_id = $orderId;
`

export const DELETE_ORDER_PRODUCT = `
  DELETE FROM order_product
  WHERE order_id = $orderId;
`
