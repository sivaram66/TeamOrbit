import { Request, Response, NextFunction } from 'express'
import {
  createInvite,
  acceptInvite,
  getPendingInvites,
  cancelInvite,
} from './invite.service'
import { CreateInviteInput } from './invite.types'

export const createInviteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: CreateInviteInput = req.body
    const orgId = req.orgId!
    const inviterName = req.user!.email

    const result = await createInvite(input, orgId, inviterName)

    res.status(201).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const acceptInviteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body
    const userId = req.user!.userId

    const result = await acceptInvite(token, userId)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getPendingInvitesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!

    const invites = await getPendingInvites(orgId)

    res.status(200).json({
      status: 'success',
      data: invites,
    })
  } catch (error) {
    next(error)
  }
}

export const cancelInviteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const inviteId = req.params.inviteId as string

    const result = await cancelInvite(inviteId, orgId)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}