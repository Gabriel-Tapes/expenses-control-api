import { Request, Response } from 'express'
import { IDeleteGainUseCase } from './deleteGainUseCase'

export const DeleteGainController = (deleteGainUseCase: IDeleteGainUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const userId = req.headers.userId as string
    const { id: gainId } = req.body

    try {
      await deleteGainUseCase.execute(userId, gainId)

      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
