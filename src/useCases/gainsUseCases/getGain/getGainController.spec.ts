import { Gain } from '@entities/gain'
import { Request, Response } from 'express'
import { IEditGainDTO } from '../editGain/IEditGainDTO'
import { GetGainController } from './getGainController'
import { IGetGainUseCase } from './getGainUseCase'

describe('Get Gain controller tests', () => {
  let getGainUseCase: IGetGainUseCase
  let getGainController: ReturnType<typeof GetGainController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const gain = new Gain({ value: 30 })

  beforeEach(() => {
    getGainUseCase = {
      execute: jest.fn(({ ownerId, gainId }: IEditGainDTO) => {
        if (ownerId === userId && gainId === gain.id)
          return Promise.resolve(gain)

        return Promise.resolve(null)
      })
    }

    req = {
      headers: {
        userId
      },
      query: {
        gainId: gain.id
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    getGainController = GetGainController(getGainUseCase)
  })

  it('should return 200 and gain object', async () => {
    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      gain: {
        id: gain.id,
        value: gain.value,
        gainedAt: gain.gainedAt,
        ownerId: userId
      }
    })
  })

  it('should return 404 and error message "gain not found" if a non-matching gain id is provided', async () => {
    req.query.gainId = 'non-matching gain id'

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'gain not found' })
  })

  it('should return 404 and error message "gain not found" if a non-matching user id is provided', async () => {
    req.headers.userId = 'non-matching user id'

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'gain not found' })
  })

  it('should return 400 and error message if thrown an error getting the gain', async () => {
    getGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error getting gain'))

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'error getting gain' })
  })
})
