import { IAuthenticateUserUseCase } from './authenticateUserUseCase'
import { AuthenticateUserController } from './authenticateUserController'
import { Request, Response } from 'express'

describe('Authenticate User controller tests', () => {
  let authenticateUserUseCase: IAuthenticateUserUseCase
  let authenticateUserController: ReturnType<typeof AuthenticateUserController>

  beforeEach(() => {
    authenticateUserUseCase = {
      execute: jest.fn(authenticateDTO => {
        if (
          authenticateDTO.email === 'joe.doe@exemple.com' &&
          authenticateDTO.password === '123456'
        ) {
          return Promise.resolve({
            user: {
              id: 'test id',
              name: 'Joe',
              lastName: 'Doe',
              email: 'joe.doe@exemple.com'
            },
            token: 'jwt token'
          })
        } else {
          return Promise.reject(new Error('Invalid credentials'))
        }
      })
    }
    authenticateUserController = AuthenticateUserController(
      authenticateUserUseCase
    )
  })
  it('should return status 200, user data and jwt token', async () => {
    const req = {
      body: {
        email: 'joe.doe@exemple.com',
        password: '123456'
      }
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    await authenticateUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 'test id',
        name: 'Joe',
        lastName: 'Doe',
        email: 'joe.doe@exemple.com'
      },
      token: 'jwt token'
    })
  })

  it('should return status 400 and error message', async () => {
    const req = {
      body: {
        email: 'invalid@email.com',
        password: 'invalid password'
      }
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    await authenticateUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid credentials'
    })
  })
})
