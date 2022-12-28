import { IUsersRepository } from '@repositories/IUsersRepository'
import { IAuthenticateUserDTO } from './IAuthenticateUserDTO'
import { compare as passwordCompare } from 'bcrypt'
import { sign as jwtSign } from 'jsonwebtoken'
import { UserProps } from '@entities/user'

export interface IAuthenticateUserUseCase {
  execute({ email, password }: IAuthenticateUserDTO): Promise<{
    user: Omit<UserProps, 'password'>
    token: string
  }>
}

export const AuthenticateUserUseCase = (
  usersRepository: IUsersRepository
): IAuthenticateUserUseCase => {
  const execute = async ({ email, password }: IAuthenticateUserDTO) => {
    const user = await usersRepository.getUserByEmail(email)

    if (!user) throw new Error('Authenticate User Error: User not found')

    const archivedPassword = await usersRepository.getUserPassword(email)

    if (!(await passwordCompare(password, archivedPassword)))
      throw new Error('Authenticate User Error: Invalid Password')

    const oneDay = 86400
    const token = jwtSign({ id: user.id }, process.env.JWTSECRET, {
      expiresIn: oneDay
    })

    return { user, token }
  }

  return Object.freeze({ execute })
}
