import { NextFunction, Request, Response } from 'express'
import { VALIDATION_ERROR } from '../lib/error-response'
import * as z from 'zod'
import { IRawStock } from '../models/stock'
import { queryParamToBool } from '../helpers/query-param-to-bool'

export function validateCreateStock(
  req: Request<
    {},
    {},
    Omit<
      IRawStock,
      | 'id'
      | 'supplierFirstName'
      | 'supplierMiddleName'
      | 'supplierLastName'
      | 'updateDate'
      | 'productName'
    >
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = createStockValidationSchema.parse(req.body)

    req.body = {
      ...body,
      isPaid: (body.isPaid === true ? 1 : body.isPaid === false ? 0 : null) as 0 | 1
    }
    next()
  } catch (error) {
    console.log(error)

    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateUpdateStock(
  req: Request<
    {},
    {},
    Omit<
      IRawStock,
      | 'id'
      | 'supplierFirstName'
      | 'supplierMiddleName'
      | 'supplierLastName'
      | 'updateDate'
      | 'productName'
    >
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = updateStockValidationSchema.parse(req.body)

    req.body = {
      ...body,
      isPaid: (body.isPaid === true ? 1 : body.isPaid === false ? 0 : null) as 0 | 1
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateGetAllStocks(
  req: Request<
    {},
    {},
    { isPaid: boolean | number | null; productId: number | null; supplierId: number | null }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = z
      .object({
        isPaid: z.boolean().nullable(),
        productId: z.number().positive().nullable(),
        supplierId: z.number().positive().nullable(),
        startDate: z.number().positive().nullable(),
        endDate: z.number().positive().nullable()
      })
      .parse(req.body)

    req.body = {
      ...body,
      isPaid: (body.isPaid === true ? 1 : body.isPaid === false ? 0 : null) as 0 | 1
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateGetPaginatedStocks(
  req: Request<
    {},
    {},
    {},
    {
      page: string
      perPage: string
      endDate: string
      startDate: string
      isPaid: string
      supplierId: string
      productId: string
      query: string
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = getPaginatedStocksValidationSchema.parse({
      page: req.query.page,
      perPage: req.query.perPage,
      supplierId: req.query.supplierId ? req.query.supplierId : null,
      productId: req.query.productId ? req.query.productId : null,
      startDate: req.query.startDate ? req.query.startDate : null,
      endDate: req.query.endDate ? req.query.endDate : null,
      isPaid: queryParamToBool(req.query.isPaid)
    })
    req.body = {
      ...body,
      isPaid: body.isPaid === true ? 1 : body.isPaid === false ? 0 : null
    }
    req.query.query = req.query.query ? `%${req.query.query}%` : '%%'
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

const createStockValidationSchema = z
  .object({
    number: z.nullable(z.string().toLowerCase().trim().max(32)),
    productId: z.number().positive(),
    quantity: z.number(),
    date: z.number(),
    cost: z.number(),
    supplierId: z.number().positive().nullable(),
    notes: z.string(),
    currency: z.enum(['USD', 'LBP']),
    dollarRate: z.number(),
    totalPaid: z.number(),
    isPaid: z.boolean()
  })
  .strict()

const updateStockValidationSchema = z
  .object({
    id: z.number().positive(),
    number: z.nullable(z.string().toLowerCase().trim().max(32)),
    date: z.number(),
    productId: z.number().positive(),
    quantity: z.number(),
    cost: z.number(),
    supplierId: z.number().positive().nullable(),
    notes: z.string(),
    currency: z.enum(['USD', 'LBP']),
    dollarRate: z.number(),
    totalPaid: z.number(),
    isPaid: z.boolean()
  })
  .strict()

const getPaginatedStocksValidationSchema = z
  .object({
    page: z.coerce.number().positive().nullable(),
    perPage: z.coerce.number().positive().nullable(),
    startDate: z.coerce.number().nullable(),
    endDate: z.coerce.number().nullable(),
    supplierId: z.coerce.number().positive().nullable(),
    productId: z.coerce.number().positive().nullable(),
    isPaid: z.boolean().nullable()
  })
  .strict()
