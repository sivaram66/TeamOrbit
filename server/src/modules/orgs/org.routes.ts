import { Router } from 'express'
import { createOrgController, getOrgController } from './org.controller'
import { authenticate } from '../../lib/middleware/auth.middleware'
import { orgResolver } from '../../lib/middleware/org.middleware'

const router = Router()

// router.post('/', authenticate, createOrgController)
router.get('/:slug', authenticate, orgResolver, getOrgController)


router.post('/', authenticate, (req, res, next) => {
  console.log('POST /api/orgs hit')
  next()
}, createOrgController)
export default router