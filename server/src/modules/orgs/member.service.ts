import prisma from '../../lib/db'
import { UpdateMemberRoleInput, TransferOwnershipInput } from './member.types'
import { NotFoundError, ForbiddenError, ValidationError } from '../../lib/errors'

export const getMembers = async (orgId: string) => {
  const memberships = await prisma.orgMembership.findMany({
    where: { orgId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return memberships
}

export const removeMember = async (
  orgId: string,
  targetUserId: string,
  requestingUserId: string
) => {
  if (targetUserId === requestingUserId) {
    throw new ValidationError('You cannot remove yourself from the organization')
  }

  const targetMembership = await prisma.orgMembership.findFirst({
    where: { orgId, userId: targetUserId },
  })

  if (!targetMembership) {
    throw new NotFoundError('Member not found in this organization')
  }

  if (targetMembership.role === 'owner') {
    throw new ForbiddenError('Cannot remove the owner of the organization')
  }

  await prisma.orgMembership.delete({
    where: { id: targetMembership.id },
  })

  return { message: 'Member removed successfully' }
}

export const updateMemberRole = async (
  orgId: string,
  targetUserId: string,
  requestingUserId: string,
  input: UpdateMemberRoleInput
) => {
  if (targetUserId === requestingUserId) {
    throw new ValidationError('You cannot change your own role')
  }

  const targetMembership = await prisma.orgMembership.findFirst({
    where: { orgId, userId: targetUserId },
  })

  if (!targetMembership) {
    throw new NotFoundError('Member not found in this organization')
  }

  if (targetMembership.role === 'owner') {
    throw new ForbiddenError('Cannot change the role of the owner')
  }

  const updated = await prisma.orgMembership.update({
    where: { id: targetMembership.id },
    data: { role: input.role },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  return updated
}

export const transferOwnership = async (
  orgId: string,
  currentOwnerId: string,
  input: TransferOwnershipInput
) => {
  if (input.newOwnerId === currentOwnerId) {
    throw new ValidationError('You are already the owner')
  }

  const newOwnerMembership = await prisma.orgMembership.findFirst({
    where: { orgId, userId: input.newOwnerId },
  })

  if (!newOwnerMembership) {
    throw new NotFoundError('New owner must be a member of the organization')
  }

  await prisma.$transaction([
    prisma.orgMembership.update({
      where: { id: newOwnerMembership.id },
      data: { role: 'owner' },
    }),
    prisma.orgMembership.updateMany({
      where: {
        orgId,
        userId: currentOwnerId,
      },
      data: { role: 'admin' },
    }),
  ])

  return { message: 'Ownership transferred successfully' }
}

export const leaveOrg = async (orgId: string, userId: string) => {
  const membership = await prisma.orgMembership.findFirst({
    where: { orgId, userId },
  })

  if (!membership) {
    throw new NotFoundError('You are not a member of this organization')
  }

  if (membership.role === 'owner') {
    throw new ForbiddenError('Owner cannot leave the organization. Transfer ownership first.')
  }

  await prisma.orgMembership.delete({
    where: { id: membership.id },
  })

  return { message: 'You have left the organization' }
}