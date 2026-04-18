import { Router } from 'express'
import {
  createProjectController,
  getProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from './project.controller'
import { authenticate } from '../../lib/middleware/auth.middleware'
import { orgResolver } from '../../lib/middleware/org.middleware'
import { requireRole } from '../../lib/middleware/rbac.middleware'

const router = Router({ mergeParams: true })

router.post('/', authenticate, orgResolver, requireRole('admin'), createProjectController)
router.get('/', authenticate, orgResolver, requireRole('member'), getProjectsController)
router.get('/:projectId', authenticate, orgResolver, requireRole('member'), getProjectByIdController)
router.put('/:projectId', authenticate, orgResolver, requireRole('admin'), updateProjectController)
router.delete('/:projectId', authenticate, orgResolver, requireRole('owner'), deleteProjectController)

export default router