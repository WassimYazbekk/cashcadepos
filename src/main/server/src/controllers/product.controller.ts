import * as Product from '../models/product'
import { Response, Request } from 'express'
import paginatedResponse from '../helpers/paginated-response'
import { isSqliteUniqueConstraintError } from '../helpers/is-sqlite-error'
import { DUPLICATE_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../lib/error-response'
import { IQuery } from '../types/query-params'

export function all(req: Request, res: Response) {
  try {
    const products = Product.all(req.body)
    return res.status(200).json({
      data: products
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
    const product = Product.findById(id)
    if (!product.id)
      return res.status(404).json({
        error: NOT_FOUND_ERROR
      })
    return res.status(200).json({
      data: product
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
    const product = req.body
    const newProduct = Product.create(product)
    return res.status(201).json({ data: newProduct })
  } catch (err) {
    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}

export function index(
  req: Request<{}, {}, Omit<Product.IPaginateParams, 'query'>, IQuery>,
  res: Response
) {
  try {
    const total = Product.count({ ...req.body, query: req.query.query })
    const products = Product.paginate({
      ...req.body,
      query: req.query.query
    })

    res.status(200).json(
      paginatedResponse<Product.IProduct>({
        data: products,
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
    const product = req.body
    if (Product.update(product)) return res.status(200).end()
    return res.status(404).json({ error: NOT_FOUND_ERROR })
  } catch (err) {
    console.log(err)

    if (isSqliteUniqueConstraintError(err)) return res.status(409).json({ error: DUPLICATE_ERROR })
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
