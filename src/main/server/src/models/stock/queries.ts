export const INSERT = `
  INSERT INTO stock_movement (product_id, supplier_id, number, date, cost, quantity, notes, dollar_rate, currency, is_paid, total_paid)
  VALUES ($productId, $supplierId, $number, $date, $cost, $quantity, $notes, $dollarRate, $currency, $isPaid, $totalPaid);
`

export const SELECT_ALL = `
  SELECT m.id, m.product_id AS productId, m.supplier_id AS supplierId, m.number, m.cost, m.date, m.currency,
    m.is_paid AS isPaid, m.update_date AS updateDate, m.quantity AS quantity, m.total_paid AS totalPaid,
    m.notes, m.dollar_rate AS dollarRate, p.name AS productName, s.first_name AS supplierFirstName,
    s.middle_name AS supplierMiddleName, s.last_name AS supplierLastName
  FROM stock_movement m
  LEFT JOIN product p
  ON m.product_id = p.id
  LEFT JOIN supplier s
  ON m.supplier_id = s.id
  WHERE (m.product_id = $productId OR $productId IS NULL);
    AND (m.supplier_id = $supplierId OR $supplierId IS NULL);
    AND (m.date > $startDate OR $startDate IS NULL);
    AND (m.date < $endDate OR $endDate IS NULL);
`

export const SELECT_BY_ID = `
  SELECT m.id, m.product_id AS productId, m.supplier_id AS supplierId, m.number, m.cost, m.date, m.currency,
    m.is_paid AS isPaid, m.update_date AS updateDate, m.quantity AS quantity, m.total_paid AS totalPaid,
    m.notes, m.dollar_rate AS dollarRate, p.name AS productName, s.first_name AS supplierFirstName,
    s.middle_name AS supplierMiddleName, s.last_name AS supplierLastName
  FROM stock_movement m
  LEFT JOIN product p
  ON m.product_id = p.id
  LEFT JOIN supplier s
  ON m.supplier_id = s.id
  WHERE m.id = ?;
`

export const COUNT = `
  SELECT COUNT(*) AS total
  FROM stock_movement m
  WHERE (m.number LIKE $query OR $query IS '%%')
    AND (m.product_id = $productId OR $productId IS NULL)
    AND (m.supplier_id = $supplierId OR $supplierId IS NULL)
    AND (m.is_paid = $isPaid OR $isPaid IS NULL)
    AND (m.date > $startDate OR $startDate IS NULL)
    AND (m.date < $endDate OR $endDate IS NULL);
`

export const SELECT_PAGINATED = `
  SELECT m.id, m.product_id AS productId, m.supplier_id AS supplierId, m.number, m.cost, m.date, m.currency,
    m.is_paid AS isPaid, m.update_date AS updateDate, m.quantity AS quantity, m.total_paid AS totalPaid,
    m.notes, m.dollar_rate AS dollarRate, p.name AS productName, s.first_name AS supplierFirstName,
    s.middle_name AS supplierMiddleName, s.last_name AS supplierLastName
  FROM stock_movement m
  LEFT JOIN product p
  ON m.product_id = p.id
  LEFT JOIN supplier s
  ON m.supplier_id = s.id
  WHERE (m.number LIKE $query OR $query IS '%%')
    AND (m.product_id = $productId OR $productId IS NULL)
    AND (m.supplier_id = $supplierId OR $supplierId IS NULL)
    AND (m.is_paid = $isPaid OR $isPaid IS NULL)
    AND (m.date > $startDate OR $startDate IS NULL)
    AND (m.date < $endDate OR $endDate IS NULL)
  ORDER BY m.id DESC
  LIMIT $perPage
  OFFSET $start;
`

export const UPDATE = `
  UPDATE stock_movement
  SET product_id = $productId,
    supplier_id = $supplierId,
    number = $number,
    date = $date,
    cost = $cost,
    quantity = $quantity,
    notes = $notes,
    dollar_rate = $dollarRate,
    is_paid = $isPaid,
    total_paid = $totalPaid,
    update_date = $updateDate,
    currency = $currency
  WHERE id = $id;
`
