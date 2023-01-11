import { Request, Response } from 'express'
import { IEditGainUseCase } from './editGainUseCase'

export const EditGainController = (editGainUseCase: IEditGainUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const userId = req.headers.userId as string
    const { id: gainId, value, gainedAt } = req.body

    try {
      const gain = await editGainUseCase.execute({
        ownerId: userId,
        gainId,
        value,
        gainedAt
      })

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
