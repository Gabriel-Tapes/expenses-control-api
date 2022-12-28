import { Request, Response } from 'express'
import { IGetAllGainsUseCase } from './getAllGainsUseCase'

export const GetAllGainsController = (
  getAllGainsUseCase: IGetAllGainsUseCase
) => {
  const handle = async (req: Request, res: Response) => {
    const userId = req.headers.userId as string

    try {
      const gains = (await getAllGainsUseCase.execute(userId)).map(gain => {
        return {
          id: gain.id,
          value: gain.value,
          gainedAt: gain.gainedAt
        }
      })

      return res.status(400).json({ ownerId: userId, gains })
    } catch (err) {
      if (err) return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
