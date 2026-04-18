import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/db'
import { RegisterInput, LoginInput, AuthTokenPayload } from './auth.types'
import { ConflictError, UnauthorizedError } from '../../lib/errors'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new ConflictError('Email already in use')
  }

  const hashedPassword = await bcrypt.hash(input.password, 10)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      hashedPassword,
    },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user) {
    throw new UnauthorizedError('Invalid credentials')
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.hashedPassword)

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials')
  }

  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}