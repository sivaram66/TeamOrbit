import { Request, Response } from 'express'
import { registerUser, loginUser } from './auth.service'
import { RegisterInput, LoginInput } from './auth.types'

export const register = async (req: Request, res: Response) => {
  try {
    const input: RegisterInput = req.body

    const result = await registerUser(input)

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const input: LoginInput = req.body

    const result = await loginUser(input, 'placeholder_hash', 'placeholder_id')

    res.status(200).json({
      message: 'Login successful',
      data: result,
    })
  } catch (error) {
    res.status(400).json({ message: 'Invalid credentials' })
  }
}