import prisma from '../../lib/db'
import { Resend } from 'resend'
import crypto from 'crypto'
import { CreateInviteInput } from './invite.types'
import { ConflictError, NotFoundError } from '../../lib/errors'

const resend = new Resend(process.env.RESEND_API_KEY)

export const createInvite = async (
  input: CreateInviteInput,
  orgId: string,
  inviterName: string
) => {
  const existingMember = await prisma.orgMembership.findFirst({
    where: {
      orgId,
      user: { email: input.email },
    },
  })

  if (existingMember) {
    throw new ConflictError('User is already a member of this organization')
  }

  const existingInvite = await prisma.invite.findFirst({
    where: { email: input.email, orgId },
  })

  if (existingInvite) {
    await prisma.invite.delete({ where: { id: existingInvite.id } })
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  })

  const invite = await prisma.invite.create({
    data: {
      email: input.email,
      role: input.role,
      token,
      expiresAt,
      orgId,
    },
  })

  await resend.emails.send({
    from: 'TeamOrbit <onboarding@resend.dev>',
    to: input.email,
    subject: `You've been invited to join ${org?.name} on TeamOrbit`,
    html: `
      <h2>You've been invited!</h2>
      <p>${inviterName} has invited you to join <strong>${org?.name}</strong> on TeamOrbit as a <strong>${input.role}</strong>.</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="http://localhost:5173/invite/accept?token=${token}">Accept Invitation</a>
      <p>This invite expires in 7 days.</p>
      <p>If you didn't expect this invitation, you can ignore this email.</p>
    `,
  })

  return { message: 'Invite sent successfully', email: input.email }
}

export const acceptInvite = async (token: string, userId: string) => {
  const invite = await prisma.invite.findUnique({
    where: { token },
  })

  if (!invite) {
    throw new NotFoundError('Invalid invite token')
  }

  if (invite.expiresAt < new Date()) {
    await prisma.invite.delete({ where: { id: invite.id } })
    throw new NotFoundError('Invite has expired')
  }

  const existingMembership = await prisma.orgMembership.findFirst({
    where: { orgId: invite.orgId, userId },
  })

  if (existingMembership) {
    throw new ConflictError('You are already a member of this organization')
  }

  await prisma.orgMembership.create({
    data: {
      userId,
      orgId: invite.orgId,
      role: invite.role,
    },
  })

  await prisma.invite.delete({ where: { id: invite.id } })

  return { message: 'Invite accepted successfully', orgId: invite.orgId }
}

export const getPendingInvites = async (orgId: string) => {
  const invites = await prisma.invite.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
  })

  return invites
}

export const cancelInvite = async (inviteId: string, orgId: string) => {
  const invite = await prisma.invite.findFirst({
    where: { id: inviteId, orgId },
  })

  if (!invite) {
    throw new NotFoundError('Invite not found')
  }

  await prisma.invite.delete({ where: { id: invite.id } })

  return { message: 'Invite cancelled successfully' }
}