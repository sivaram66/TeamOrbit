import { z } from 'zod'

export const createInviteSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),

  role: z.enum(['member', 'admin'], {
    errorMap: () => ({ message: 'Role must be member or admin' }),
  }),
})

export const acceptInviteSchema = z.object({
  token: z
    .string({ required_error: 'Token is required' })
    .uuid('Invalid token format'),
})