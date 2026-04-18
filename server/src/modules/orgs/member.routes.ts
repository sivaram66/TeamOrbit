import { Router } from 'express'
import {
  getMembersController,
  removeMemberController,
  updateMemberRoleController,
  transferOwnershipController,
  leaveOrgController,
} from './member.controller'
import { authenticate } from '../../lib/middleware/auth.middleware'
import { orgResolver } from '../../lib/middleware/org.middleware'
import { requireRole } from '../../lib/middleware/rbac.middleware'
import { validate } from '../../lib/middleware/validate.middleware'
import { updateMemberRoleSchema, transferOwnershipSchema } from './member.schemas'

const router = Router({ mergeParams: true })

router.get('/', authenticate, orgResolver, requireRole('member'), getMembersController)
router.delete('/leave', authenticate, orgResolver, requireRole('member'), leaveOrgController)
router.delete('/:userId', authenticate, orgResolver, requireRole('admin'), removeMemberController)
router.patch('/:userId/role', authenticate, orgResolver, requireRole('admin'), validate(updateMemberRoleSchema), updateMemberRoleController)
router.post('/transfer-ownership', authenticate, orgResolver, requireRole('owner'), validate(transferOwnershipSchema), transferOwnershipController)

export default router