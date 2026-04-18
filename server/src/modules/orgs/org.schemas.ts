import { z } from 'zod'

export const createOrgSchema = z.object({
  name: z
    .string({ required_error: 'Organization name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),

  slug: z
    .string({ required_error: 'Slug is required' })
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug can only contain lowercase letters, numbers and hyphens'
    ),
})