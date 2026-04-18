import { z } from 'zod'

const validStatuses = ['todo', 'in_progress', 'in_review', 'done'] as const
const validPriorities = [0, 1, 2, 3] as const

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Task title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be at most 200 characters'),

  status: z
    .enum(validStatuses, {
      errorMap: () => ({ message: 'Status must be todo, in_progress, in_review or done' }),
    })
    .optional()
    .default('todo'),

  priority: z
    .number()
    .refine(val => validPriorities.includes(val as any), {
      message: 'Priority must be 0, 1, 2 or 3',
    })
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
      errorMap: () => ({ message: 'Status must be todo, in_progress, in_review or done' }),
    })
    .optional(),

  priority: z
    .number()
    .refine(val => validPriorities.includes(val as any), {
      message: 'Priority must be 0, 1, 2 or 3',
    })
    .optional(),

  assigneeId: z
    .string()
    .optional(),
})