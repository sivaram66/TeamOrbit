import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../errors'

const ROLE_HIERARCHY: Record<string, number> = {
  member: 1,
  admin: 2,
  owner: 3,
}

export const requireRole = (minimumRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.role

      if (!userRole) {
        throw new ForbiddenError('No role found')
      }

      const userRoleLevel = ROLE_HIERARCHY[userRole] ?? 0
      const requiredRoleLevel = ROLE_HIERARCHY[minimumRole] ?? 0

      if (userRoleLevel < requiredRoleLevel) {
        throw new ForbiddenError('You do not have permission to perform this action')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}