import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import prisma from '../../lib/db'
import redis from '../../lib/redis'
import { RegisterInput, LoginInput, AuthTokenPayload, RefreshTokenPayload, AuthResponse } from './auth.types'
import { ConflictError, UnauthorizedError } from '../../lib/errors'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret'
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60

  const generateTokens = async (userId: string, email: string): Promise<{ accessToken: string, refreshToken: string }> => {
  const accessPayload: AuthTokenPayload = { userId, email }
  const accessToken = jwt.sign(accessPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })

  const tokenId = crypto.randomUUID()
  const refreshPayload: RefreshTokenPayload = { userId, tokenId }
  const refreshToken = jwt.sign(refreshPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' })

  await redis.set(
    `refresh:${userId}:${tokenId}`,
    'valid',
    { ex: REFRESH_TOKEN_EXPIRY }
  )

  return { accessToken, refreshToken }
}

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

  const { accessToken, refreshToken } = await generateTokens(user.id, user.email)

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

export const refreshTokens = async (token: string) => {
  let payload: RefreshTokenPayload

  try {
    payload = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload
  } catch {
    throw new UnauthorizedError('Invalid refresh token')
  }

  const redisKey = `refresh:${payload.userId}:${payload.tokenId}`
  const exists = await redis.get(redisKey)

  if (!exists) {
    throw new UnauthorizedError('Refresh token has been revoked')
  }

  await redis.del(redisKey)

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  if (!user) {
    throw new UnauthorizedError('User not found')
  }

  const { accessToken, refreshToken } = await generateTokens(user.id, user.email)

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

export const logoutUser = async (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload
    await redis.del(`refresh:${payload.userId}:${payload.tokenId}`)
  } catch {
    // Token already invalid — that's fine
  }
}