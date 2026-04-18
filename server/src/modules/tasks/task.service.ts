import prisma from '../../lib/db'
import { CreateTaskInput, UpdateTaskInput } from './task.types'
import { NotFoundError } from '../../lib/errors'

export const createTask = async (
  input: CreateTaskInput,
  projectId: string,
  orgId: string
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, orgId },
  })

  if (!project) {
    throw new NotFoundError('Project not found')
  }

  const task = await prisma.task.create({
    data: {
      title: input.title,
      status: input.status || 'todo',
      priority: input.priority || 0,
      assigneeId: input.assigneeId || null,
      projectId,
      orgId,
    },
  })

  return task
}

export const getTasksByProject = async (projectId: string, orgId: string) => {
  const tasks = await prisma.task.findMany({
    where: { projectId, orgId },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return tasks
}

export const getTaskById = async (taskId: string, orgId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, orgId },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  return task
}

export const updateTask = async (
  taskId: string,
  orgId: string,
  input: UpdateTaskInput
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, orgId },
  })

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: input,
  })

  return updated
}

export const deleteTask = async (taskId: string, orgId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, orgId },
  })

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  await prisma.task.delete({
    where: { id: taskId },
  })
}