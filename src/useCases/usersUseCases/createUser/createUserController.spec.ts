import { User } from '@entities/user'
import { Request, Response } from 'express'
import { CreateUserController } from './createUserController'
import { ICreateUserUseCase } from './createUserUseCase'

describe('Create User controller tests', () => {
  let createUserUseCase: ICreateUserUseCase
  let createUserController: ReturnType<typeof CreateUserController>
  let req: Request
  let res: Response

  beforeEach(() => {
    createUserUseCase = {
      execute: jest.fn().mockResolvedValue({
        user: {
          id: 'userId',
          name: 'Joe',
          lastName: 'Doe',
          email: 'joe.doe@example.com'
        } as Omit<User, 'password'>,
        token: 'jwt token'
      })
    }

    createUserController = CreateUserController(createUserUseCase)
    req = {} as Request
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
    req.body = {
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@example.com',
      password: 'password'
    }
  })

  it('should call createUserUseCase.execute with the right params', async () => {
    await createUserController.handle(req, res)
    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@example.com',
      password: 'password'
    })
  })

  it('should return a 200 status and user and token in the response body', async () => {
    await createUserController.handle(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 'userId',
        name: 'Joe',
        lastName: 'Doe',
        email: 'joe.doe@example.com'
      } as Omit<User, 'password'>,
      token: 'jwt token'
    })
  })

  it('should return a 400 status and error message in the response body when an error occurs', async () => {
    const error = new Error('something went wrong')

    createUserUseCase.execute = jest.fn().mockRejectedValue(error)

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'something went wrong' })
  })
})
