import { Router } from 'express'
import {
  createInviteController,
  acceptInviteController,
  getPendingInvitesController,
  cancelInviteController,
} from './invite.controller'
import { authenticate } from '../../lib/middleware/auth.middleware'
import { orgResolver } from '../../lib/middleware/org.middleware'
import { requireRole } from '../../lib/middleware/rbac.middleware'

const router = Router({ mergeParams: true })

router.post('/', authenticate, orgResolver, requireRole('admin'), createInviteController)
router.get('/', authenticate, orgResolver, requireRole('admin'), getPendingInvitesController)
router.delete('/:inviteId', authenticate, orgResolver, requireRole('admin'), cancelInviteController)

export default router