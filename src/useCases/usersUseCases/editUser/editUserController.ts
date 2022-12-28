import { Request, Response } from 'express'
import { IEditUserUseCase } from './editUserUseCase'

export const EditUserController = (editUserUseCase: IEditUserUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const { id, name, lastName, password } = req.body

    try {
      const editedUser = await editUserUseCase.execute({
        id,
        name,
        lastName,
        password
      })

      if (id !== req.headers.userId)
        return res.status(403).json({ error: 'access denied' })

      return res.status(200).json({
        user: editedUser
      })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
