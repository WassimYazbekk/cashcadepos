import * as Customer from '../models/customer'
import { Response, Request } from 'express'
import paginatedResponse from '../helpers/paginated-response'
import { DUPLICATE_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../lib/error-response'
import { IQuery } from '../types/query-params'
import { NAME_EXISTS_ERROR } from '../lib/throwable'

export function all(_: Request, res: Response) {
  try {
    const customers = Customer.all()
    return res.status(200).json({
      data: customers
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
    const customer = Customer.findById(id)
    if (!customer.id)
      return res.status(404).json({
        error: NOT_FOUND_ERROR
      })
    return res.status(200).json({
      data: customer
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
    const newCustomer = Customer.create(req.body)
    return res.status(201).json({ data: newCustomer })
  } catch (err) {
    console.log(err)
    if (err instanceof Error && err === NAME_EXISTS_ERROR)
      return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export function index(
  req: Request<{}, {}, Omit<Customer.IPaginateParams, 'query'>, IQuery>,
  res: Response
) {
  try {
    const total = Customer.count(req.query.query)
    const customers = Customer.paginate({ ...req.body, query: req.query.query })
    return res.status(200).json(
      paginatedResponse<Customer.ICustomer>({
        data: customers,
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
    const customer = req.body
    if (Customer.update(customer)) return res.status(200).end
    return res.status(404).json({ error: NOT_FOUND_ERROR })
  } catch (err) {
    console.log(err)
    if (err instanceof Error && err === NAME_EXISTS_ERROR)
      return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
