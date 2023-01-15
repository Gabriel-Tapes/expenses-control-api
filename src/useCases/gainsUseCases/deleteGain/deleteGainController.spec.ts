import { Gain } from '@entities/gain'
import { Request, Response } from 'express'
import { DeleteGainController } from './deleteGainController'
import { IDeleteGainUseCase } from './deleteGainUseCase'

describe('Delete Gain controller tests', () => {
  let deleteGainUseCase: IDeleteGainUseCase
  let deleteGainController: ReturnType<typeof DeleteGainController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const gain = new Gain({ value: 30 })

  beforeEach(async () => {
    deleteGainUseCase = {
      execute: jest.fn()
    }

    deleteGainController = DeleteGainController(deleteGainUseCase)

    req = {
      headers: {
        userId
      },
      body: {
        id: gain.id
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
  })

  it('should return 200 if gain is successfully deleted', async () => {
    await deleteGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ ok: true })
  })

  it('should return 400 if an error is thrown while deleting the gain', async () => {
    deleteGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('gain not found'))

    await deleteGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'gain not found' })
  })
})
