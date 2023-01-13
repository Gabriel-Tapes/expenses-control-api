import { User } from '@entities/user'
import { GetUserController } from './getUserController'
import { IGetUserUseCase } from './getUserUseCase'
import { Request, Response } from 'express'

describe('Get User controller tests', () => {
  let getUserUseCase: IGetUserUseCase
  let getUserController: ReturnType<typeof GetUserController>

  beforeEach(() => {
    getUserUseCase = {
      execute: jest.fn(id => {
        if (id === 'userId')
          return Promise.resolve({
            id: 'userId',
            name: 'Joe',
            lastName: 'Doe',
            email: 'joe.doe@example.com'
          } as Omit<User, 'password'>)

        return Promise.reject(new Error('user not found'))
      })
    }

    getUserController = GetUserController(getUserUseCase)
  })

  it('should be able to get an user with a matching id', async () => {
    const req = {
      headers: {
        userId: 'userId'
      },
      query: {
        id: 'userId'
      }
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@example.com'
    })
  })

  it('should return 400 status with a non-matching id', async () => {
    const req = {
      headers: {
        userId: 'non-matching userId'
      },
      query: {
        id: 'non-matching userId'
      }
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return 403 status with a non-matching id and userId', async () => {
    const req = {
      headers: {
        userId: 'userId'
      },
      query: {
        id: 'non-matching id'
      }
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(getUserUseCase.execute).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({ error: 'access denied' })
  })

  it('should return 400 status with a blank id', async () => {
    const req = {
      headers: {
        userId: 'userId'
      },
      query: {
        id: ''
      }
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'no such user id given' })
    expect(getUserUseCase.execute).not.toHaveBeenCalled()
  })
})
