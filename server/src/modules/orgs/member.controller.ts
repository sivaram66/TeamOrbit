import { Request, Response, NextFunction } from 'express'
import {
  getMembers,
  removeMember,
  updateMemberRole,
  transferOwnership,
  leaveOrg,
} from './member.service'
import { UpdateMemberRoleInput, TransferOwnershipInput } from './member.types'

export const getMembersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!

    const members = await getMembers(orgId)

    res.status(200).json({
      status: 'success',
      data: members,
    })
  } catch (error) {
    next(error)
  }
}

export const removeMemberController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const targetUserId = req.params.userId as string
    const requestingUserId = req.user!.userId

    const result = await removeMember(orgId, targetUserId, requestingUserId)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const updateMemberRoleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const targetUserId = req.params.userId as string
    const requestingUserId = req.user!.userId
    const input: UpdateMemberRoleInput = req.body

    const result = await updateMemberRole(orgId, targetUserId, requestingUserId, input)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const transferOwnershipController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const currentOwnerId = req.user!.userId
    const input: TransferOwnershipInput = req.body

    const result = await transferOwnership(orgId, currentOwnerId, input)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const leaveOrgController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.orgId!
    const userId = req.user!.userId

    const result = await leaveOrg(orgId, userId)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}