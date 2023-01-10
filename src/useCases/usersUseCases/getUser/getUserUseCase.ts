import { User } from '@entities/user'
import { IUsersRepository } from '@repositories/IUsersRepository'

export interface IGetUserUseCase {
  execute(id: string): Promise<Omit<User, 'password'>>
}

export const GetUserUseCase = (usersRepository: IUsersRepository) => {
  const execute = async (id: string): Promise<Omit<User, 'password'>> => {
    if (!id) throw new Error('No id provided')

    const user = await usersRepository.getUserById(id)

    if (!user) throw new Error('User not found')

    return {
      id,
      name: user.name,
      lastName: user.lastName,
      email: user.email
    }
  }

  return Object.freeze({ execute })
}
