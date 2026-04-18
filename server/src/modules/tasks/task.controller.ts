import { Request, Response, NextFunction } from 'express'
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} from './task.service'
import { CreateTaskInput, UpdateTaskInput } from './task.types'
import { getPaginationParams } from '../../lib/pagination'

export const createTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: CreateTaskInput = req.body
    const orgId = req.orgId!
    const projectId = req.params.projectId as string

    const task = await createTask(input, projectId, orgId)

    res.status(201).json({
      status: 'success',
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

export const getTasksByProjectController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const projectId = req.params.projectId as string
    const pagination = getPaginationParams(req.query)

    const tasks = await getTasksByProject(projectId, orgId, pagination)

    res.status(200).json({
      status: 'success',
      ...tasks,
    })
  } catch (error) {
    next(error)
  }
}

export const getTaskByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const taskId = req.params.taskId as string

    const task = await getTaskById(taskId, orgId)

    res.status(200).json({
      status: 'success',
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

export const updateTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const taskId = req.params.taskId as string
    const input: UpdateTaskInput = req.body

    const task = await updateTask(taskId, orgId, input)

    res.status(200).json({
      status: 'success',
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const taskId = req.params.taskId as string

    await deleteTask(taskId, orgId)

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}