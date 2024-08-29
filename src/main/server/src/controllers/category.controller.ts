import * as Category from '../models/category'
import { Response, Request } from 'express'
import { isSqliteUniqueConstraintError } from '../helpers/is-sqlite-error'
import paginatedResponse from '../helpers/paginated-response'
import { DUPLICATE_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../lib/error-response'
import { IQuery } from '../types/query-params'
import { DONT_EXISTS_ERROR } from '../lib/throwable'

export function all(req: Request<{}, {}, { isViewable: boolean | null }>, res: Response) {
  try {
    const categories = Category.all(req.body.isViewable)
    res.status(200).json({
      data: categories
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function show(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const category = Category.findById(id)
    return res.status(200).json({
      data: category
    })
  } catch (error) {
    console.log(error)
    if (error instanceof Error && error === DONT_EXISTS_ERROR)
      return res.status(404).json({
        error: NOT_FOUND_ERROR
      })
    return res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function store(req: Request, res: Response) {
  try {
    const newCategory = Category.create(req.body)
    return res.status(201).json({ data: newCategory })
  } catch (err) {
    console.log(err)
    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export function index(
  req: Request<{}, {}, Omit<Category.IPaginateParams, 'query'>, IQuery>,
  res: Response
) {
  try {
    const total = Category.count(req.query.query, req.body.isViewable)
    const categories = Category.paginate({ ...req.body, query: req.query.query })
    res.status(200).json(
      paginatedResponse<Category.ICategory>({
        data: categories,
        total: total,
        perPage: req.body.perPage,
        totalPages: Math.ceil(total / req.body.perPage),
        page: req.body.page
      })
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function update(req: Request, res: Response) {
  try {
    if (Category.update(req.body)) return res.status(200).end()
    return res.status(404).json({ error: NOT_FOUND_ERROR })
  } catch (err) {
    console.log(err)
    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
