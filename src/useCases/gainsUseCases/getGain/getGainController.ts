import { Request, Response } from 'express'
import { IGetGainUseCase } from './getGainUseCase'

export const GetGainController = (getGainUseCase: IGetGainUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const userId = req.headers.userId as string
    const gainId = req.query.gainId.toString()

    try {
      const gain = await getGainUseCase.execute({ gainId })

      if (!gain) return res.status(404).json({ error: 'gain not found' })

      if (userId !== gain.ownerId)
        return res.status(403).json({ error: 'access denied' })

      return res.status(200).json({
        gain: {
          id: gain.gain.id,
          value: gain.gain.value,
          gainedAt: gain.gain.gainedAt,
          ownerId: gain.ownerId
        }
      })
    } catch (err) {
      if (err) return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
