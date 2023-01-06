import { User, UserProps } from '@entities/user'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { ICreateUserDTO } from './ICreateUserDTO'
import { sign as jwtSign } from 'jsonwebtoken'

export interface ICreateUserUseCase {
  execute({ name, lastName, email, password }: ICreateUserDTO): Promise<{
    user: Omit<UserProps, 'password'>
    token: string
  }>
}

export const CreateUserUseCase = (usersRepository: IUsersRepository) => {
  const execute = async ({
    name,
    lastName,
    email,
    password
  }: ICreateUserDTO): Promise<{
    user: Omit<UserProps, 'password'>
    token: string
  }> => {
    const newUser = new User({
      name,
      lastName,
      email,
      password
    })

    const userExists = await usersRepository.getUserByEmail(newUser.email)

    if (userExists) throw new Error('Create user error: User already exists')

    await usersRepository.createUser(newUser)

    const oneDay = 86400
    const token = jwtSign({ id: newUser.id }, process.env.JWTSECRET, {
      expiresIn: oneDay
    })

    return {
      user: {
        id: newUser.id,
        name,
        lastName,
        email
      },
      token
    }
  }

  return Object.freeze({ execute })
}
