import { Gain } from '@entities/gain'
import { Request, Response } from 'express'
import { RegisterGainController } from './registerGainController'
import { IRegisterGainUseCase } from './registerGainUseCase'

describe('Register Gain controller tests', () => {
  let registerGainUseCase: IRegisterGainUseCase
  let registerGainController: ReturnType<typeof RegisterGainController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const gain = new Gain({ value: 30 })

  beforeEach(() => {
    registerGainUseCase = {
      execute: jest.fn(() => {
        return Promise.resolve(gain)
      })
    }

    req = {
      headers: {
        userId
      },
      body: {
        value: 30
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    registerGainController = RegisterGainController(registerGainUseCase)
  })

  it('should return status 201 and gain object', async () => {
    await registerGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      gain: {
        id: gain.id,
        value: gain.value,
        ownerId: userId,
        gainedAt: gain.gainedAt
      }
    })
  })

  it('should return status 400 and error message if thrown an error while register the gain', async () => {
    registerGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error creating gain'))

    await registerGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'error creating gain' })
  })
})
