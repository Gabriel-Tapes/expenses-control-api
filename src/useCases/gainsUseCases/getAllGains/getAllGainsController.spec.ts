import { Gain } from '@entities/gain'
import { Request, Response } from 'express'
import { GetAllGainsController } from './getAllGainsController'
import { IGetAllGainsUseCase } from './getAllGainsUseCase'

describe('Get all Gains controller tests', () => {
  let getAllGainsUseCase: IGetAllGainsUseCase
  let getAllGainsController: ReturnType<typeof GetAllGainsController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const gain = new Gain({ value: 30 })

  beforeEach(() => {
    getAllGainsUseCase = {
      execute: jest.fn(ownerId => {
        if (ownerId === userId) return Promise.resolve([gain])
        else return Promise.resolve([])
      })
    }

    req = {
      headers: {
        userId
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    getAllGainsController = GetAllGainsController(getAllGainsUseCase)
  })

  it('should return 200 and gains list', async () => {
    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ownerId: userId,
      gains: [
        {
          id: gain.id,
          value: gain.value,
          gainedAt: gain.gainedAt
        }
      ]
    })
  })

  it('should return 200 and an empty list if the owner not have gains registered', async () => {
    const userWithoutGainsId = 'user without gains registered id'

    req.headers.userId = userWithoutGainsId

    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ownerId: userWithoutGainsId,
      gains: []
    })
  })

  it('should return 400 if an error ocurred while get all gains', async () => {
    getAllGainsUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error getting all gains'))

    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'error getting all gains' })
  })
})
