import { Request, Response } from 'express'
import { IDeleteUserUseCase } from './deleteUserUseCase'

export const DeleteUserController = (deleteUserUseCase: IDeleteUserUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const { id } = req.body

    if (id !== req.headers.userId)
      return res.status(403).json({ error: 'access denied' })

    try {
      await deleteUserUseCase.execute(id)

      res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
