import { Request, Response } from 'express'
import { ICreateUserUseCase } from './createUserUseCase'

export const CreateUserController = (createUserUseCase: ICreateUserUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body

    try {
      const { user, token } = await createUserUseCase.execute({
        name,
        lastName,
        email,
        password
      })

      res.status(200).json({ user, token })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
