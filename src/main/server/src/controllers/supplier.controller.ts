import * as Supplier from '../models/supplier'
import { Response, Request } from 'express'
import paginatedResponse from '../helpers/paginated-response'
import { DUPLICATE_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../lib/error-response'
import { IQuery } from '../types/query-params'
import { NAME_EXISTS_ERROR } from '../lib/throwable'

export function all(_: Request, res: Response) {
  try {
    const suppliers = Supplier.all()
    return res.status(200).json({
      data: suppliers
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function show(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const supplier = Supplier.findById(id)
    if (!supplier.id)
      return res.status(404).json({
        error: NOT_FOUND_ERROR
      })
    return res.status(200).json({
      data: supplier
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
    const newSupplier = Supplier.create(req.body)
    return res.status(201).json({ data: newSupplier })
  } catch (err) {
    console.log(err)
    if (err instanceof Error && err === NAME_EXISTS_ERROR)
      return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export function index(
  req: Request<{}, {}, Omit<Supplier.IPaginateParams, 'query'>, IQuery>,
  res: Response
) {
  try {
    const total = Supplier.count(req.query.query)
    const suppliers = Supplier.paginate({ ...req.body, query: req.query.query })
    return res.status(200).json(
      paginatedResponse<Supplier.ISupplier>({
        data: suppliers,
        total: total,
        perPage: req.body.perPage,
        totalPages: Math.ceil(total / req.body.perPage),
        page: req.body.page
      })
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  }
}

export function update(req: Request, res: Response) {
  try {
    const supplier = req.body
    if (Supplier.update(supplier)) return res.status(200).end()
    return res.status(404).json({ error: NOT_FOUND_ERROR })
  } catch (err) {
    console.log(err)
    if (err instanceof Error && err === NAME_EXISTS_ERROR)
      return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
