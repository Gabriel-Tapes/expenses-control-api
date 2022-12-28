import { Request, Response } from 'express'
import { IGetUserUseCase } from './getUserUseCase'

export const GetUserController = (getUserUseCase: IGetUserUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const id = req.query.id.toString()

    if (!id) return res.status(400).json({ error: 'no such user id given' })

    if (id !== req.headers.userId)
      return res.status(403).json({ error: 'access denied' })

    try {
      const { name, lastName, email } = await getUserUseCase.execute(id)

      return res.status(200).json({ name, lastName, email })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
