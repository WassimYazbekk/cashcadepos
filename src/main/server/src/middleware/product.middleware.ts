import { NextFunction, Request, Response } from 'express'
import { VALIDATION_ERROR } from '../lib/error-response'
import { IRawProduct } from '../models/product'
import * as z from 'zod'
import { queryParamToBool } from '../helpers/query-param-to-bool'

export function validateCreateProduct(
  req: Request<{}, {}, Omit<IRawProduct, 'id' | 'category' | 'remainingQuantity'>>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = createProductValidationSchema.parse(req.body)

    req.body = {
      ...body,
      isViewable: (body.isViewable === true ? 1 : body.isViewable === false ? 0 : null) as 0 | 1
    }
    next()
  } catch (error) {
    console.log(error)

    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateUpdateProduct(
  req: Request<{}, {}, Omit<IRawProduct, 'remainingQuantity' | 'category'>>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = updateProductValidationSchema.parse(req.body)

    req.body = {
      ...body,
      isViewable: (body.isViewable === true ? 1 : body.isViewable === false ? 0 : null) as 0 | 1
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateGetAllProducts(
  req: Request<{}, {}, {}, { isViewable: string; categoryId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = z
      .object({ isViewable: z.boolean().nullable(), categoryId: z.number().positive().nullable() })
      .parse({
        isViewable: queryParamToBool(req.query.isViewable),
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : null
      })

    req.body = {
      ...body,
      isViewable: body.isViewable === true ? 1 : body.isViewable === false ? 0 : null
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateGetPaginatedProducts(
  req: Request<
    {},
    {},
    {},
    {
      page: string
      perPage: string
      isViewable: string
      categoryId: string
      query: string
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = getPaginatedProductsValidationSchema.parse({
      page: req.query.page,
      perPage: req.query.perPage,
      isViewable: queryParamToBool(req.query.isViewable),
      categoryId: req.query.categoryId ? req.query.categoryId : null
    })
    req.body = {
      ...body,
      isViewable: body.isViewable === true ? 1 : body.isViewable === false ? 0 : null
    }
    req.query.query = req.query.query ? `%${req.query.query}%` : '%%'
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

const createProductValidationSchema = z
  .object({
    name: z.string().toLowerCase().trim().min(1).max(32),
    image: z.string(),
    categoryId: z.number().positive().nullable(),
    price: z.number(),
    currency: z.enum(['USD', 'LBP']),
    isViewable: z.boolean()
  })
  .strict()

const updateProductValidationSchema = z
  .object({
    id: z.number().positive(),
    name: z.string().toLowerCase().trim().min(1).max(32),
    image: z.string(),
    categoryId: z.number().positive().nullable(),
    price: z.number(),
    currency: z.enum(['USD', 'LBP']),
    isViewable: z.boolean()
  })
  .strict()

const getPaginatedProductsValidationSchema = z
  .object({
    page: z.coerce.number().positive().nullable(),
    perPage: z.coerce.number().positive().nullable(),
    isViewable: z.boolean().nullable(),
    categoryId: z.coerce.number().positive().nullable()
  })
  .strict()
