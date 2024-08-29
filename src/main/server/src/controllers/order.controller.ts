import * as Order from '../models/order'
import { Response, Request } from 'express'
import { IPaginatedResponse } from '../types/response'
import { INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../lib/error-response'
import { IQuery } from '../types/query-params'
import paginatedResponse from '../helpers/paginated-response'

export function all(
  req: Request<{}, {}, Omit<Order.IPaginateParams, 'page' | 'perPage' | 'query'>>,
  res: Response
) {
  try {
    const order = Order.all(req.body)
    return res.status(200).json({
      data: order
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
    const order = Order.findById(id)
    if (!order.id)
      return res.status(404).json({
        error: NOT_FOUND_ERROR
      })
    return res.status(200).json({
      data: order
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
    const newOrder = Order.create(req.body)
    return res.status(201).json({ data: newOrder })
  } catch (err) {
    console.log(err)

    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export function index(req: Request<{}, {}, Order.IPaginateParams, IQuery>, res: Response) {
  try {
    const data = Order.paginate({ ...req.body, query: req.query.query })
    const total = Order.count({ ...req.body, query: req.query.query })
    const response: IPaginatedResponse<Omit<Order.IOrder, 'products'>> = paginatedResponse({
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
    const order = req.body
    if (Order.update(order)) return res.status(200).end
    return res.status(404).json({ error: NOT_FOUND_ERROR })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
