import * as Stock from '../models/stock'
import { Response, Request } from 'express'
import { isSqliteUniqueConstraintError } from '../helpers/is-sqlite-error'
import { IPaginatedResponse } from '../types/response'
import { DUPLICATE_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../lib/error-response'
import { IQuery } from '../types/query-params'
import paginatedResponse from '../helpers/paginated-response'

export function all(
  req: Request<{}, {}, Omit<Stock.IPaginateParams, 'page' | 'perPage' | 'query'>>,
  res: Response
) {
  try {
    const stock = Stock.all(req.body)
    return res.status(200).json({
      data: stock
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function show(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const stock = Stock.findById(id)
    if (!stock.id)
      return res.status(404).json({
        error: NOT_FOUND_ERROR
      })
    return res.status(200).json({
      data: stock
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function store(req: Request, res: Response) {
  try {
    Stock.create(req.body)
    return res.status(201).end()
  } catch (err) {
    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export function index(req: Request<{}, {}, Stock.IPaginateParams, IQuery>, res: Response) {
  try {
    const data = Stock.paginate({ ...req.body, query: req.query.query })
    const total = Stock.count({ ...req.body, query: req.query.query })
    const response: IPaginatedResponse<Stock.IStock> = paginatedResponse({
      data: data,
      total: total,
      totalPages: Math.ceil(total / req.body.perPage),
      perPage: req.body.perPage,
      page: req.body.page
    })

    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function update(req: Request, res: Response) {
  try {
    const stock = req.body
    if (Stock.update(stock)) return res.status(200).end()
    return res.status(404).json({ error: NOT_FOUND_ERROR })
  } catch (err) {
    console.log(err)

    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
