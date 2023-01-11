import { Request, Response } from 'express'
import { IGetGainUseCase } from './getGainUseCase'

export const GetGainController = (getGainUseCase: IGetGainUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const userId = req.headers.userId as string
    const gainId = req.query.gainId.toString()

    try {
      const gain = await getGainUseCase.execute({ ownerId: userId, gainId })

      if (!gain) return res.status(404).json({ error: 'gain not found' })

      return res.status(200).json({
        gain: {
          id: gain.id,
          value: gain.value,
          gainedAt: gain.gainedAt,
          ownerId: userId
        }
      })
    } catch (err) {
      if (err) return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
