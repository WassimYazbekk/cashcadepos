import { NextFunction, Request, Response } from 'express'
import { VALIDATION_ERROR } from '../lib/error-response'
import * as z from 'zod'
import { ICustomer } from '../models/customer'
import { IQuery } from '../types/query-params'

export function validateCreateCustomer(
  req: Request<{}, {}, Omit<ICustomer, 'id'>>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = createCustomerValidationSchema.parse(req.body)
    next()
  } catch (error) {
    console.log(error)

    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateUpdateCustomer(
  req: Request<{}, {}, ICustomer>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = updateCustomerValidationSchema.parse(req.body)
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateGetPaginatedCustomers(
  req: Request<{}, {}, { page: number | null; perPage: number | null }, IQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = getPaginatedCustomersValidationSchema.parse({ ...req.body })
    req.query = req.query.query ? { query: `%${req.query.query}%` } : { query: '%%' }
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

const createCustomerValidationSchema = z
  .object({
    firstName: z.string().toLowerCase().trim().min(1).max(32),
    middleName: z.string().toLowerCase().trim().max(32),
    lastName: z.string().toLowerCase().trim().min(1).max(32),
    phoneNumber: z.string().toLowerCase().trim()
  })
  .strict()

const updateCustomerValidationSchema = z
  .object({
    id: z.number().positive(),
    firstName: z.string().toLowerCase().trim().min(1).max(32),
    middleName: z.string().toLowerCase().trim().max(32),
    lastName: z.string().toLowerCase().trim().min(1).max(32),
    phoneNumber: z.string().toLowerCase().trim()
  })
  .strict()

const getPaginatedCustomersValidationSchema = z
  .object({
    page: z.number().positive().nullable(),
    perPage: z.number().positive().nullable()
  })
  .strict()
