import { z } from 'zod'

export const updateMemberRoleSchema = z.object({
  role: z.enum(['member', 'admin'], {
    error: 'Role must be member or admin',
  }),
})

export const transferOwnershipSchema = z.object({
  newOwnerId: z
    .string()
    .min(1, 'New owner ID is required'),
})