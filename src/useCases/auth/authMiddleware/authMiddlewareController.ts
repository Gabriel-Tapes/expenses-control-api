import { NextFunction, Request, Response } from 'express'
import { IAuthMiddlewareUseCase } from './authMiddlewareUseCase'

export const AuthMiddlewareController = (
  authMiddlewareUseCase: IAuthMiddlewareUseCase
) => {
  const handle = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token)
      return res.status(401).json({
        error: 'No token provided'
      })

    try {
      const id = authMiddlewareUseCase.execute(token)
      req.headers.userId = id

      return next()
    } catch (err) {
      return res.status(401).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
