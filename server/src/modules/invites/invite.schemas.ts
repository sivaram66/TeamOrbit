import { z } from 'zod'

export const createInviteSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),

  role: z.enum(['member', 'admin'], {
    error: 'Role must be member or admin',
  }),
})

export const acceptInviteSchema = z.object({
  token: z
    .string()
    .uuid('Invalid token format'),
})