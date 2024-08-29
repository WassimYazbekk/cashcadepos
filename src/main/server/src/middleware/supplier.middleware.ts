import { NextFunction, Request, Response } from 'express'
import { VALIDATION_ERROR } from '../lib/error-response'
import * as z from 'zod'
import { ISupplier } from '../models/supplier'

export function validateCreateSupplier(
  req: Request<{}, {}, Omit<ISupplier, 'id'>>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = createSupplierValidationSchema.parse(req.body)
    next()
  } catch (error) {
    console.log(error)

    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateUpdateSupplier(
  req: Request<{}, {}, ISupplier>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = updateSupplierValidationSchema.parse(req.body)
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateGetPaginatedSuppliers(
  req: Request<{}, {}, {}, { page: string; perPage: string; query: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = getPaginatedSuppliersValidationSchema.parse({
      page: req.query.page,
      perPage: req.query.perPage
    })
    req.query.query = req.query.query ? `%${req.query.query}%` : '%%'
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

const createSupplierValidationSchema = z
  .object({
    firstName: z.string().toLowerCase().trim().min(1).max(32),
    middleName: z.string().toLowerCase().trim().max(32),
    lastName: z.string().toLowerCase().trim().min(1).max(32),
    phoneNumber: z.string().toLowerCase().trim()
  })
  .strict()

const updateSupplierValidationSchema = z
  .object({
    id: z.number().positive(),
    firstName: z.string().toLowerCase().trim().min(1).max(32),
    middleName: z.string().toLowerCase().trim().max(32),
    lastName: z.string().toLowerCase().trim().min(1).max(32),
    phoneNumber: z.string().toLowerCase().trim()
  })
  .strict()

const getPaginatedSuppliersValidationSchema = z
  .object({
    page: z.coerce.number().positive().nullable(),
    perPage: z.coerce.number().positive().nullable()
  })
  .strict()
