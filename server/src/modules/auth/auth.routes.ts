import { Router } from 'express'
import { register, login, refresh, logout } from './auth.controller'
import { validate } from '../../lib/middleware/validate.middleware'
import { registerSchema, loginSchema, refreshTokenSchema, logoutSchema } from './auth.schemas'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', validate(refreshTokenSchema), refresh)
router.post('/logout', validate(logoutSchema), logout)

export default router