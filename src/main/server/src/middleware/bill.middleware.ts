import { NextFunction, Request, Response } from 'express'
import { VALIDATION_ERROR } from '../lib/error-response'
import * as z from 'zod'
import { IRawBill } from '../models/bill'
import { queryParamToBool } from '../helpers/query-param-to-bool'

export function validateCreateBill(
  req: Request<
    {},
    {},
    Omit<
      IRawBill,
      'id' | 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName' | 'updateDate'
    >
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = createBillValidationSchema.parse(req.body)

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

export function validateUpdateBill(
  req: Request<
    {},
    {},
    Omit<
      IRawBill,
      'id' | 'supplierFirstName' | 'supplierMiddleName' | 'supplierLastName' | 'updateDate'
    >
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = updateBillValidationSchema.parse(req.body)

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

export function validateGetAllBills(
  req: Request<
    {},
    {},
    { isPaid: boolean | number | null; startDate: number | null; endDate: number | null }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = z
      .object({
        isPaid: z.boolean().nullable(),
        startDate: z.number().nullable(),
        endDate: z.number().nullable()
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

export function validateGetPaginatedBills(
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
      query: string
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = getPaginatedBillsValidationSchema.parse({
      page: req.query.page,
      perPage: req.query.perPage,
      supplierId: req.query.supplierId ? req.query.supplierId : null,
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

const createBillValidationSchema = z
  .object({
    number: z.nullable(z.string().toLowerCase().trim().max(32)),
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

const updateBillValidationSchema = z
  .object({
    id: z.number().positive(),
    number: z.nullable(z.string().toLowerCase().trim().max(32)),
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

const getPaginatedBillsValidationSchema = z
  .object({
    page: z.coerce.number().positive().nullable(),
    perPage: z.coerce.number().positive().nullable(),
    startDate: z.coerce.number().nullable(),
    endDate: z.coerce.number().nullable(),
    supplierId: z.coerce.number().positive().nullable(),
    isPaid: z.boolean().nullable()
  })
  .strict()
