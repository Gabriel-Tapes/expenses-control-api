import { Request, Response } from 'express'
import { IAuthenticateUserUseCase } from './authenticateUserUseCase'

export const AuthenticateUserController = (
  authenticateUserUseCase: IAuthenticateUserUseCase
) => {
  const handle = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const { user, token } = await authenticateUserUseCase.execute({
        email,
        password
      })

      return res.status(200).json({
        user,
        token
      })
    } catch (err) {
      if (err)
        return res.status(400).json({
          error: err.message
        })
    }
  }

  return Object.freeze({ handle })
}
