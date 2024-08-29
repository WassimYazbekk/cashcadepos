export const INSERT = `
  INSERT INTO product (category_id, name, price, image, currency, is_viewable)
  VALUES ($categoryId, $name, $price, $image, $currency, $isViewable);
`

export const SELECT_ALL = `
  SELECT p.id, p.category_id AS categoryId, p.name, p.price, p.image, p.currency,
    p.is_viewable AS isViewable, p.remaining_quantity AS remainingQuantity,
    c.name AS category
  FROM product p
  LEFT JOIN category c
  ON p.category_id = c.id
  WHERE (p.is_viewable = $isViewable OR $isViewable IS NULL)
    AND (p.category_id = $categoryId OR $categoryId IS NULL);
`

export const SELECT_BY_ID = `
  SELECT p.id, p.category_id AS categoryId, p.name, p.price, p.image, p.currency,
    p.is_viewable AS isViewable, p.remaining_quantity AS remainingQuantity,
    c.name AS category
  FROM product p
  LEFT JOIN category c
  ON p.category_id = c.id
  WHERE p.id = ?;
`

export const SELECT_BY_NAME = `
  SELECT p.id, p.category_id AS categoryId, p.name, p.price, p.image, p.currency,
    p.is_viewable AS isViewable, p.remaining_quantity AS remainingQuantity,
    c.name AS category
  FROM product p
  LEFT JOIN category c
  ON p.category_id = c.id
  WHERE p.name = ?;
`

export const COUNT = `
  SELECT COUNT(*) AS total
  FROM product
  WHERE name LIKE $query
    AND (category_id = $categoryId OR $categoryId IS NULL)
    AND (is_viewable = $isViewable OR $isViewable IS NULL);
`

export const SELECT_PAGINATED = `
  SELECT p.id, p.category_id AS categoryId, p.name, p.price, p.image, p.currency,
    p.is_viewable AS isViewable, p.remaining_quantity AS remainingQuantity,
    c.name AS category
  FROM product p
  LEFT JOIN category c
  ON p.category_id = c.id
  WHERE p.name LIKE $query
    AND (p.category_id = $categoryId OR $categoryId IS NULL)
    AND (p.is_viewable = $isViewable OR $isViewable IS NULL)
  ORDER BY p.id ASC
  LIMIT $perPage
  OFFSET $start;
`

export const UPDATE_BY_USER = `
  UPDATE product
  SET price = $price,
    name = $name,
    category_id = $categoryId,
    image = $image,
    currency = $currency,
    is_viewable = $isViewable
  WHERE id = $id;
`

export const UPDATE_QUANTITY = `
  UPDATE product
  SET remaining_quantity = $remainingQuantity
  WHERE id = $id;
`
