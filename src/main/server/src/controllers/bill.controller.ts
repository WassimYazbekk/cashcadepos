import * as Bill from '../models/bill'
import { Response, Request } from 'express'
import { isSqliteUniqueConstraintError } from '../helpers/is-sqlite-error'
import { IPaginatedResponse } from '../types/response'
import { DUPLICATE_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../lib/error-response'
import { IQuery } from '../types/query-params'
import paginatedResponse from '../helpers/paginated-response'

export function all(
  req: Request<{}, {}, Omit<Bill.IPaginateParams, 'page' | 'perPage' | 'query'>>,
  res: Response
) {
  try {
    const bill = Bill.all(req.body)
    return res.status(200).json({
      data: bill
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
    const bill = Bill.findById(id)
    if (!bill.id)
      return res.status(404).json({
        error: NOT_FOUND_ERROR
      })
    return res.status(200).json({
      data: bill
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
    Bill.create(req.body)
    return res.status(201).end()
  } catch (err) {
    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export function index(req: Request<{}, {}, Bill.IPaginateParams, IQuery>, res: Response) {
  try {
    const data = Bill.paginate({ ...req.body, query: req.query.query })
    const total = Bill.count({ ...req.body, query: req.query.query })
    const response: IPaginatedResponse<Bill.IBill> = paginatedResponse({
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
    const bill = req.body
    if (Bill.update(bill)) return res.status(200).end()
    return res.status(404).json({ error: NOT_FOUND_ERROR })
  } catch (err) {
    console.log(err)

    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
