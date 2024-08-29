export const INSERT = `
  INSERT INTO bill (supplier_id, number, date, cost, notes, dollar_rate, currency, is_paid, total_paid)
  VALUES ($supplierId, $number, $date, $cost, $notes, $dollarRate, $currency, $isPaid, $totalPaid);
`

export const SELECT_ALL = `
  SELECT b.id, b.supplier_id AS supplierId, b.number, b.cost, b.date, b.currency,
    b.is_paid AS isPaid, b.update_date AS updateDate, b.total_paid AS totalPaid,
    b.notes, b.dollar_rate AS dollarRate, s.first_name AS supplierFirstName,
    s.middle_name AS supplierMiddleName,s.last_name AS supplierLastName
  FROM bill b
  LEFT JOIN supplier s
  ON b.supplier_id = s.id
  WHERE (b.supplier_id = $supplierId OR $supplierId IS NULL)
    AND (b.is_paid = $isPaid OR $isPaid IS NULL)
    AND (b.date > $startDate OR $startDate IS NULL)
    AND (b.date < $endDate OR $endDate IS NULL);
`

export const SELECT_BY_ID = `
  SELECT b.id, b.supplier_id AS supplierId, b.number, b.cost, b.date, b.currency,
    b.is_paid AS isPaid, b.update_date AS updateDate, b.total_paid AS totalPaid,
    b.notes, b.dollar_rate AS dollarRate, s.first_name AS supplierFirstName,
    s.middle_name AS supplierMiddleName,s.last_name AS supplierLastName
  FROM bill b
  LEFT JOIN supplier s
  ON b.supplier_id = s.id
  WHERE b.id = ?;
`

export const COUNT = `
  SELECT COUNT(*) AS total
  FROM bill b
  WHERE (b.number LIKE $query OR $query IS '%%')
    AND (b.supplier_id = $supplierId OR $supplierId IS NULL)
    AND (b.is_paid = $isPaid OR $isPaid IS NULL)
    AND (b.date > $startDate OR $startDate IS NULL)
    AND (b.date < $endDate OR $endDate IS NULL);
`

export const SELECT_PAGINATED = `
  SELECT b.id, b.supplier_id AS supplierId, b.number, b.cost, b.date, b.currency,
    b.is_paid AS isPaid, b.update_date AS updateDate, b.total_paid AS totalPaid,
    b.notes, b.dollar_rate AS dollarRate, s.first_name AS supplierFirstName,
    s.middle_name AS supplierMiddleName,s.last_name AS supplierLastName
  FROM bill b
  LEFT JOIN supplier s
  ON b.supplier_id = s.id
  WHERE (b.number LIKE $query OR $query IS '%%')
    AND (b.supplier_id = $supplierId OR $supplierId IS NULL)
    AND (b.is_paid = $isPaid OR $isPaid IS NULL)
    AND (b.date > $startDate OR $startDate IS NULL)
    AND (b.date < $endDate OR $endDate IS NULL)
  ORDER BY b.id DESC
  LIMIT $perPage
  OFFSET $start;
`

export const UPDATE = `
  UPDATE bill
  SET supplier_id = $supplierId,
    number = $number,
    date = $date,
    cost = $cost,
    notes = $notes,
    dollar_rate = $dollarRate,
    is_paid = $isPaid,
    total_paid = $totalPaid,
    update_date = $updateDate,
    currency = $currency
  WHERE id = $id;
`
