import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { ValidationError } from '../errors'

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const message = (result.error as ZodError).issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ')

      return next(new ValidationError(message))
    }

    req.body = result.data
    next()
  }
}