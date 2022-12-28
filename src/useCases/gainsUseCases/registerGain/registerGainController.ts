import { Request, Response } from 'express'
import { IRegisterGainUseCase } from './registerGainUseCase'

export const RegisterGainController = (
  registerGainUseCase: IRegisterGainUseCase
) => {
  const handle = async (req: Request, res: Response) => {
    const ownerId = req.headers.userId as string
    const value = req.body.value as number
    try {
      const gain = await registerGainUseCase.execute({ ownerId, value })

      return res.status(201).json({
        gain: {
          id: gain.id,
          value: gain.value,
          ownerId,
          gainedAt: gain.gainedAt
        }
      })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
