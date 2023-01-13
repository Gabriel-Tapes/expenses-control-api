import { EditUserController } from './editUserController'
import { IEditUserUseCase } from './editUserUseCase'
import { Request, Response } from 'express'

describe('Edit User controller tests', () => {
  let editUserUseCase: IEditUserUseCase
  let editUserController: ReturnType<typeof EditUserController>
  let req: Request
  let res: Response

  beforeEach(() => {
    editUserUseCase = {
      execute: jest.fn()
    }

    req = {
      headers: {
        userId: '1'
      },
      body: {
        id: '1',
        name: 'test',
        lastName: 'test',
        password: 'password'
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    editUserController = EditUserController(editUserUseCase)
  })

  it('should return 403 if id in request body is different from userId in headers', async () => {
    req.headers.userId = '2'
    await editUserController.handle(req, res)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'access denied' })
  })

  it('should return 200 and user object if id in request body is the same as userId in headers', async () => {
    const expectedUser = {
      id: '1',
      name: 'test',
      lastName: 'test',
      password: 'password'
    }
    editUserUseCase.execute = jest.fn().mockResolvedValue(expectedUser)
    await editUserController.handle(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ user: expectedUser })
  })

  it('should return 400 and error message if an error is thrown', async () => {
    const errorMessage = 'Error editing user'

    editUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage))

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage })
  })
})
