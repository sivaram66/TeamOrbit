import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z
    .string({ required_error: 'Project name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),

  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
})

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),

  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
})