import express from 'express'
import helmet from 'helmet'
import authRouter from './modules/auth/auth.routes'
import orgRouter from './modules/orgs/org.routes'
import projectRouter from './modules/projects/project.routes'
import taskRouter from './modules/tasks/task.routes'
import inviteRouter from './modules/invites/invite.routes'
import { authenticate } from './lib/middleware/auth.middleware'
import { acceptInviteController } from './modules/invites/invite.controller'
import { errorHandler } from './lib/middleware/error.middleware'
import { validate } from './lib/middleware/validate.middleware'
import { acceptInviteSchema } from './modules/invites/invite.schemas'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'TeamOrbit server is running' })
})

app.use('/api/auth', authRouter)
app.use('/api/orgs', orgRouter)
app.use('/api/orgs/:slug/projects', projectRouter)
app.use('/api/orgs/:slug/projects/:projectId/tasks', taskRouter)
app.use('/api/orgs/:slug/invites', inviteRouter)

app.post('/api/invites/accept', authenticate, validate(acceptInviteSchema), acceptInviteController)

app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app