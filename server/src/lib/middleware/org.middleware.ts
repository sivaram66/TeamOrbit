import { Request, Response, NextFunction } from 'express'
import prisma from '../db'
import { NotFoundError, ForbiddenError } from '../errors'

export const orgResolver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string

    if (!slug) {
      throw new NotFoundError('Org slug is required')
    }

    const org = await prisma.organization.findUnique({
      where: { slug },
    })

    if (!org) {
      throw new NotFoundError('Organization not found')
    }

    const membership = await prisma.orgMembership.findFirst({
      where: {
        orgId: org.id,
        userId: req.user!.userId,
      },
    })

    if (!membership) {
      throw new ForbiddenError('You are not a member of this organization')
    }

    req.orgId = org.id
    req.role = membership.role
    next()
  } catch (error) {
    next(error)
  }
}