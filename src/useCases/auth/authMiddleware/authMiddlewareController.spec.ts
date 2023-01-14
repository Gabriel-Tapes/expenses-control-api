import { NextFunction, Request, Response } from 'express'
import { AuthMiddlewareController } from './authMiddlewareController'
import { IAuthMiddlewareUseCase } from './authMiddlewareUseCase'

describe('Auth middleware controller tests', () => {
  let authMiddlewareUseCase: IAuthMiddlewareUseCase
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    authMiddlewareUseCase = {
      execute: jest.fn(() => 'userId')
    }

    req = {
      headers: {
        authorization: 'token'
      }
    } as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    next = jest.fn()
  })

  it('should return a 401 status if no token is provided', async () => {
    req.headers.authorization = undefined

    const authMiddlewareController = AuthMiddlewareController(
      authMiddlewareUseCase
    )
    await authMiddlewareController.handle(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No token provided'
    })
  })

  it('should call authMiddlewareUseCase.execute with the provided token', async () => {
    const authMiddlewareController = AuthMiddlewareController(
      authMiddlewareUseCase
    )

    await authMiddlewareController.handle(req, res, next)

    expect(authMiddlewareUseCase.execute).toHaveBeenCalledWith('token')
  })

  it('should set userId on the headers of the request', async () => {
    const authMiddlewareController = AuthMiddlewareController(
      authMiddlewareUseCase
    )

    await authMiddlewareController.handle(req, res, next)

    expect(req.headers.userId).toBe('userId')
  })

  it('should call next function if successful', async () => {
    const authMiddlewareController = AuthMiddlewareController(
      authMiddlewareUseCase
    )

    await authMiddlewareController.handle(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should return a 401 status and error message if authMiddlewareUseCase.execute throws an error', async () => {
    authMiddlewareUseCase.execute = jest.fn(() => {
      throw new Error('Error message')
    })

    const authMiddlewareController = AuthMiddlewareController(
      authMiddlewareUseCase
    )
    await authMiddlewareController.handle(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error message'
    })
  })
})
