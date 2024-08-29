import { NextFunction, Request, Response } from 'express'
import { VALIDATION_ERROR } from '../lib/error-response'
import * as z from 'zod'
import { IQuery } from '../types/query-params'

export function validateCreateOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createOrderValidationSchema.parse(req.body)

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

export function validateUpdateOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const body = updateOrderValidationSchema.parse(req.body)

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

export function validateGetAllOrders(
  req: Request<
    {},
    {},
    {
      customerId: number | bigint | null
      type: 'SALE' | 'REFUND' | null
      isPaid: boolean | null | number
      startDate: number | null
      endDate: number | null
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = z
      .object({
        isPaid: z.boolean().nullable(),
        customerId: z.number().positive().nullable(),
        startDate: z.number().positive().nullable(),
        type: z.enum(['SALE', 'REFUND']),
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

export function validateGetPaginatedOrders(
  req: Request<
    {},
    {},
    {
      page: number | null
      perPage: number | null
      endDate: number | null
      startDate: number | null
      type: 'SALE' | 'REFUND' | null
      isPaid: boolean | number | null
      customerId: number | null
    },
    IQuery
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = getPaginatedOrdersValidationSchema.parse({ ...req.body })
    req.body = {
      ...body,
      isPaid: body.isPaid === true ? 1 : body.isPaid === false ? 0 : null
    }
    req.query = req.query.query ? { query: `%${req.query.query}%` } : { query: '%%' }
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

const createOrderValidationSchema = z
  .object({
    customerId: z.number().positive().nullable(),
    date: z.number(),
    totalPrice: z.number(),
    notes: z.string(),
    currency: z.enum(['USD', 'LBP']),
    dollarRate: z.number(),
    totalPaid: z.number(),
    isPaid: z.boolean(),
    type: z.enum(['SALE', 'REFUND']),
    discount: z.number(),
    delivery: z.number(),
    products: z.array(
      z.object({
        productId: z.number().positive(),
        pricePerItem: z.number(),
        quantity: z.number(),
        currency: z.enum(['USD', 'LBP'])
      })
    )
  })
  .strict()

const updateOrderValidationSchema = z
  .object({
    id: z.number().positive(),
    customerId: z.number().positive().nullable(),
    date: z.number(),
    totalPrice: z.number(),
    notes: z.string(),
    currency: z.enum(['USD', 'LBP']),
    dollarRate: z.number(),
    totalPaid: z.number(),
    isPaid: z.boolean(),
    type: z.enum(['SALE', 'REFUND']),
    discount: z.number(),
    delivery: z.number(),
    products: z.array(
      z.object({
        productId: z.number().positive(),
        pricePerItem: z.number(),
        quantity: z.number(),
        currency: z.enum(['USD', 'LBP'])
      })
    )
  })
  .strict()

const getPaginatedOrdersValidationSchema = z
  .object({
    page: z.number().positive().nullable(),
    perPage: z.number().positive().nullable(),
    startDate: z.number().nullable(),
    endDate: z.number().nullable(),
    supplierId: z.number().positive().nullable(),
    isPaid: z.boolean().nullable(),
    customerId: z.number().positive().nullable(),
    type: z.enum(['SALE', 'REFUND'])
  })
  .strict()
