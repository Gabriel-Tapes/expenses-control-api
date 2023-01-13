import { Request, Response } from 'express'
import { DeleteUserController } from './deleteUserController'
import { IDeleteUserUseCase } from './deleteUserUseCase'

describe('Delete User controller tests', () => {
  let deleteUserUseCase: IDeleteUserUseCase
  let deleteUserController: ReturnType<typeof DeleteUserController>
  let req: Request
  let res: Response

  beforeEach(() => {
    deleteUserUseCase = {
      execute: jest.fn()
    }

    deleteUserController = DeleteUserController(deleteUserUseCase)

    req = {
      headers: {
        userId: '123'
      },
      body: {
        id: '123'
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
  })

  it('should return 403 if user id in request body does not match user id in headers', async () => {
    req.body.id = '456'
    await deleteUserController.handle(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'access denied' })
  })

  it('should return 400 if an error is thrown while deleting the user', async () => {
    deleteUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('user not found'))

    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return 200 if user is successfully deleted', async () => {
    await deleteUserController.handle(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ ok: true })
  })

  it('should call deleteUserUseCase.execute with the correct id', async () => {
    await deleteUserController.handle(req, res)

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith('123')
  })
})
