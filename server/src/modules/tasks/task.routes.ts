import { Router } from 'express'
import {
  createTaskController,
  getTasksByProjectController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from './task.controller'
import { authenticate } from '../../lib/middleware/auth.middleware'
import { orgResolver } from '../../lib/middleware/org.middleware'
import { requireRole } from '../../lib/middleware/rbac.middleware'

const router = Router({ mergeParams: true })

router.post('/', authenticate, orgResolver, requireRole('member'), createTaskController)
router.get('/', authenticate, orgResolver, requireRole('member'), getTasksByProjectController)
router.get('/:taskId', authenticate, orgResolver, requireRole('member'), getTaskByIdController)
router.put('/:taskId', authenticate, orgResolver, requireRole('member'), updateTaskController)
router.delete('/:taskId', authenticate, orgResolver, requireRole('admin'), deleteTaskController)

export default router