import prisma from '../../lib/db'
import { CreateProjectInput, UpdateProjectInput } from './project.types'
import { NotFoundError } from '../../lib/errors'

export const createProject = async (input: CreateProjectInput, orgId: string) => {
  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      orgId,
    },
  })

  return project
}

export const getProjects = async (orgId: string) => {
  const projects = await prisma.project.findMany({
    where: { orgId },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return projects
}

export const getProjectById = async (projectId: string, orgId: string) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, orgId },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!project) {
    throw new NotFoundError('Project not found')
  }

  return project
}

export const updateProject = async (
  projectId: string,
  orgId: string,
  input: UpdateProjectInput
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, orgId },
  })

  if (!project) {
    throw new NotFoundError('Project not found')
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: input,
  })

  return updated
}

export const deleteProject = async (projectId: string, orgId: string) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, orgId },
  })

  if (!project) {
    throw new NotFoundError('Project not found')
  }

  await prisma.project.delete({
    where: { id: projectId },
  })
}