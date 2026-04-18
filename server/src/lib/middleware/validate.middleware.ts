import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ValidationError } from '../errors'

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const message = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ')

      return next(new ValidationError(message))
    }

    req.body = result.data
    next()
  }
}