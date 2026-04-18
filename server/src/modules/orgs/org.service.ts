import prisma from '../../lib/db'
import { CreateOrgInput } from './org.types'
import { ConflictError, NotFoundError, ForbiddenError, ValidationError } from '../../lib/errors'

export const createOrg = async (input: CreateOrgInput, userId: string) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (!slugRegex.test(input.slug)) {
    throw new ValidationError('Slug can only contain lowercase letters, numbers and hyphens')
  }

  const existingOrg = await prisma.organization.findUnique({
    where: { slug: input.slug },
  })

  if (existingOrg) {
    throw new ConflictError('Slug already taken')
  }

  const org = await prisma.organization.create({
    data: {
      name: input.name,
      slug: input.slug,
    },
  })

  await prisma.orgMembership.create({
    data: {
      userId,
      orgId: org.id,
      role: 'owner',
    },
  })

  return org
}

export const getOrgBySlug = async (slug: string, userId: string) => {
  const org = await prisma.organization.findUnique({
    where: { slug: slug },
    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!org) {
    throw new NotFoundError('Organization not found')
  }

  const membership = org.memberships.find(m => m.userId === userId)

  if (!membership) {
    throw new ForbiddenError('You are not a member of this organization')
  }

  return org
}

export const getUserOrgs = async (userId: string) => {
  const memberships = await prisma.orgMembership.findMany({
    where: { userId },
    include: {
      org: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  return memberships.map(m => ({
    ...m.org,
    role: m.role,
  }))
}