import { Request, Response, NextFunction } from 'express'
import { createOrg, getOrgBySlug, getUserOrgs } from './org.service'
import { CreateOrgInput } from './org.types'

export const createOrgController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: CreateOrgInput = req.body
    const userId = req.user!.userId

    const org = await createOrg(input, userId)

    res.status(201).json({
      status: 'success',
      data: org,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrgController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string
    const userId = req.user!.userId

    const org = await getOrgBySlug(slug, userId)

    res.status(200).json({
      status: 'success',
      data: org,
    })
  } catch (error) {
    next(error)
  }
}


export const getUserOrgsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const orgs = await getUserOrgs(userId)

    res.status(200).json({
      status: 'success',
      data: orgs,
    })
  } catch (error) {
    next(error)
  }
}