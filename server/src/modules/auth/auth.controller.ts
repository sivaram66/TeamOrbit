import { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser, refreshTokens, logoutUser } from './auth.service'
import { RegisterInput, LoginInput } from './auth.types'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: RegisterInput = req.body

    const result = await registerUser(input)

    res.status(201).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: LoginInput = req.body

    const result = await loginUser(input)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body

    const result = await refreshTokens(refreshToken)

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body

    await logoutUser(refreshToken)

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}