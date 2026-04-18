import { z } from 'zod'

const validStatuses = ['todo', 'in_progress', 'in_review', 'done'] as const

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be at most 200 characters'),

  status: z
    .enum(validStatuses, {
      error: 'Status must be todo, in_progress, in_review or done',
    })
    .optional()
    .default('todo'),

  priority: z
    .number()
    .min(0, 'Priority must be between 0 and 3')
    .max(3, 'Priority must be between 0 and 3')
    .optional()
    .default(0),

  assigneeId: z
    .string()
    .optional(),
})

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be at most 200 characters')
    .optional(),

  status: z
    .enum(validStatuses, {
      error: 'Status must be todo, in_progress, in_review or done',
    })
    .optional(),

  priority: z
    .number()
    .min(0, 'Priority must be between 0 and 3')
    .max(3, 'Priority must be between 0 and 3')
    .optional(),

  assigneeId: z
    .string()
    .optional(),
})