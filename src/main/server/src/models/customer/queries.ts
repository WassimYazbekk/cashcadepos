export const INSERT = `
  INSERT INTO customer (first_name, middle_name, last_name, phone_number)
  VALUES($firstName, $middleName, $lastName, $phoneNumber);
`

export const SELECT_ALL = `
  SELECT id, phone_number AS phoneNumber, first_name as firstName,
    middle_name as middleName, last_name as lastName
  FROM customer;
`

export const SELECT_BY_ID = `
  SELECT id, phone_number AS phoneNumber, first_name AS firstName,
    middle_name AS middleName, last_name AS lastName
  FROM customer
  WHERE id = ?;
`

export const SELECT_BY_NAME = `
  SELECT * FROM customer
  WHERE first_name = $firstName
  AND middle_name = $middleName
  AND last_name = $lastName;
`

export const COUNT = `
  SELECT COUNT(*) AS total
  FROM customer
  WHERE first_name LIKE $query
    OR middle_name LIKE $query
    OR last_name LIKE $query
    OR phone_number LIKE $query;
`

export const SELECT_PAGINATED = `
  SELECT id, phone_number AS phoneNumber, first_name AS firstName,
    middle_name AS middleName, last_name AS lastName
  FROM customer
  WHERE first_name LIKE $query
    OR middle_name LIKE $query
    OR last_name LIKE $query
    OR phone_number LIKE $query
  ORDER BY id ASC
  LIMIT $perPage
  OFFSET $start;
`

export const UPDATE = `
  UPDATE customer
  SET first_name = $firstName,
    middle_name = $middleName,
    last_name = $lastName,
    phone_number = $phoneNumber
  WHERE id = $id;
`
