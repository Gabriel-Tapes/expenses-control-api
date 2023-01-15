import { Gain } from '@entities/gain'
import { Request, Response } from 'express'
import { EditGainController } from './editGainController'
import { IEditGainUseCase } from './editGainUseCase'
import { IEditGainDTO } from './IEditGainDTO'

describe('Edit Gain controller tests', () => {
  let editGainUseCase: IEditGainUseCase
  let editGainController: ReturnType<typeof EditGainController>

  let req: Request
  let res: Response

  const userId = 'userId'

  const gain = new Gain({ value: 30 })
  const editedGain = new Gain({ value: 50, gainedAt: new Date(5000) }, gain.id)

  beforeEach(() => {
    editGainUseCase = {
      execute: jest.fn(({ ownerId, gainId }: IEditGainDTO) => {
        if (ownerId === userId && gainId === gain.id)
          return Promise.resolve(editedGain)
        else return Promise.resolve(null)
      })
    }

    req = {
      headers: {
        userId
      },

      body: {
        id: gain.id,
        value: editedGain.value,
        gainedAt: editedGain.gainedAt
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    editGainController = EditGainController(editGainUseCase)
  })

  it('should return status 200 and edited gain', async () => {
    await editGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      gain: {
        id: editedGain.id,
        value: editedGain.value,
        gainedAt: editedGain.gainedAt,
        ownerId: userId
      }
    })
  })

  it('should return status 404 if non-matching user id is provided', async () => {
    req.headers.userId = 'non-matching user id'

    await editGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'gain not found' })
  })

  it('should return status 404 if non-matching gain id is provided', async () => {
    req.body.id = 'non-matching gain id'

    await editGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'gain not found' })
  })

  it('should return 400 and error message id an error is thrown editing the gain', async () => {
    editGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error editing gain'))

    await editGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'error editing gain' })
  })
})
