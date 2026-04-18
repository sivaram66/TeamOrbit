import { Router } from 'express'
import { createOrgController, getOrgController } from './org.controller'
import { authenticate } from '../../lib/middleware/auth.middleware'
import { orgResolver } from '../../lib/middleware/org.middleware'
import { validate } from '../../lib/middleware/validate.middleware'
import { createOrgSchema } from './org.schemas'

const router = Router()

router.post('/', authenticate, validate(createOrgSchema), createOrgController)
router.get('/:slug', authenticate, orgResolver, getOrgController)

export default router