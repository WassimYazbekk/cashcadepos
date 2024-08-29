export const INSERT = `
  INSERT INTO category (name, image, is_viewable)
  VALUES($name, $image, $isViewable);
`

export const SELECT_ALL = `
  SELECT id, name, image, is_viewable as isViewable
  FROM category
  WHERE (is_viewable = $isViewable OR $isViewable IS NULL);
`

export const SELECT_BY_ID = `
  SELECT id, name, is_viewable AS isViewable, image
  FROM category
  WHERE id = ?;
`

export const SELECT_BY_NAME = `
  SELECT id, name, is_viewable AS isViewable, image
  FROM category
  WHERE name = ?;
`

export const COUNT = `
  SELECT COUNT(*) AS total
  FROM category
  WHERE name LIKE $query
    AND (is_viewable = $isViewable OR $isViewable IS NULL);
`

export const SELECT_PAGINATED = `
  SELECT id, name, image, is_viewable as isViewable
  FROM category
  WHERE name LIKE $query
    AND (is_viewable = $isViewable OR $isViewable IS NULL)
  ORDER BY id ASC
  LIMIT $perPage
  OFFSET $start;
`

export const UPDATE = `
  UPDATE category
  SET name = $name,
    image = $image,
    is_viewable = $isViewable
  WHERE id = $id;
`
