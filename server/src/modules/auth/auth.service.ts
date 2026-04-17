import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RegisterInput, LoginInput, AuthTokenPayload } from './auth.types'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'

export const registerUser = async (input: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(input.password, 10)

  return {
    name: input.name,
    email: input.email,
    hashedPassword,
  }
}

export const loginUser = async (
  input: LoginInput,
  storedHashedPassword: string,
  userId: string
) => {
  const isPasswordValid = await bcrypt.compare(input.password, storedHashedPassword)

  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

  const payload: AuthTokenPayload = {
    userId,
    email: input.email,
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

  return { token }
}