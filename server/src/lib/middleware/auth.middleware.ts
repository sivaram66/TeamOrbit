import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthTokenPayload } from '../../modules/auth/auth.types'
import { UnauthorizedError } from '../errors'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload
      req.user = decoded
      next()
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired')
      }
      throw new UnauthorizedError('Invalid token')
    }
  } catch (error) {
    next(error)
  }
}