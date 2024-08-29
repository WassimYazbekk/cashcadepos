import { NextFunction, Request, Response } from 'express'
import { VALIDATION_ERROR } from '../lib/error-response'
import { IRawCategory } from '../models/category'
import * as z from 'zod'
import { queryParamToBool } from '../helpers/query-param-to-bool'

export function validateCreateCategory(
  req: Request<{}, {}, Omit<IRawCategory, 'id'>>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = createCategoryValidationSchema.parse(req.body)

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

export function validateUpdateCategory(
  req: Request<{}, {}, IRawCategory>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = updateCategoryValidationSchema.parse(req.body)

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

export function validateGetAllCategories(
  req: Request<{}, {}, {}, { isViewable: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = z
      .object({ isViewable: z.boolean().nullable() })
      .parse({ isViewable: queryParamToBool(req.query.isViewable) })

    req.body = {
      isViewable: body.isViewable === true ? 1 : body.isViewable === false ? 0 : null
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: VALIDATION_ERROR })
  }
}

export function validateGetPaginatedCategories(
  req: Request<
    {},
    {},
    {},
    {
      page: string
      perPage: string
      isViewable: string
      query: string
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const body = getPaginatedCategoriesValidationSchema.parse({
      page: req.query.page,
      perPage: req.query.perPage,
      isViewable: queryParamToBool(req.query.isViewable)
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

const createCategoryValidationSchema = z
  .object({
    name: z.string().toLowerCase().trim().min(1).max(32),
    image: z.string(),
    isViewable: z.boolean()
  })
  .strict()

const updateCategoryValidationSchema = z
  .object({
    id: z.number().positive(),
    name: z.string().toLowerCase().trim().min(1).max(32),
    image: z.string(),
    isViewable: z.boolean()
  })
  .strict()

const getPaginatedCategoriesValidationSchema = z
  .object({
    page: z.coerce.number().positive().nullable(),
    perPage: z.coerce.number().positive().nullable(),
    isViewable: z.boolean().nullable()
  })
  .strict()
