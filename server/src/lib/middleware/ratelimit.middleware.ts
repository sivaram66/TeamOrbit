import { Request, Response, NextFunction } from 'express'
import { Ratelimit } from '@upstash/ratelimit'
import redis from '../redis'

const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  prefix: 'ratelimit:auth',
})

const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  prefix: 'ratelimit:api',
})

const getIp = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown'
  )
}

export const authRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = getIp(req)
    const { success, limit, remaining, reset } = await authLimiter.limit(ip)

    res.setHeader('X-RateLimit-Limit', limit)
    res.setHeader('X-RateLimit-Remaining', remaining)
    res.setHeader('X-RateLimit-Reset', reset)

    if (!success) {
      res.status(429).json({
        status: 'error',
        message: 'Too many attempts. Please try again in 15 minutes.',
      })
      return
    }

    next()
  } catch (error) {
    next()
  }
}

export const apiRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = getIp(req)
    const { success, limit, remaining, reset } = await apiLimiter.limit(ip)

    res.setHeader('X-RateLimit-Limit', limit)
    res.setHeader('X-RateLimit-Remaining', remaining)
    res.setHeader('X-RateLimit-Reset', reset)

    if (!success) {
      res.status(429).json({
        status: 'error',
        message: 'Too many requests. Please slow down.',
      })
      return
    }

    next()
  } catch (error) {
    next()
  }
}