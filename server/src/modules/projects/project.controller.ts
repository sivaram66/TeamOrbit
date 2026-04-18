import { Request, Response, NextFunction } from 'express'
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from './project.service'
import { CreateProjectInput, UpdateProjectInput } from './project.types'
import { getPaginationParams } from '../../lib/pagination'

export const createProjectController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: CreateProjectInput = req.body
    const orgId = req.orgId!

    const project = await createProject(input, orgId)

    res.status(201).json({
      status: 'success',
      data: project,
    })
  } catch (error) {
    next(error)
  }
}

export const getProjectsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const pagination = getPaginationParams(req.query)

    const result = await getProjects(orgId, pagination)

    res.status(200).json({
      status: 'success',
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

export const getProjectByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const projectId = req.params.projectId as string

    const project = await getProjectById(projectId, orgId)

    res.status(200).json({
      status: 'success',
      data: project,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProjectController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const projectId = req.params.projectId as string
    const input: UpdateProjectInput = req.body

    const project = await updateProject(projectId, orgId, input)

    res.status(200).json({
      status: 'success',
      data: project,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProjectController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const projectId = req.params.projectId as string

    await deleteProject(projectId, orgId)

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}