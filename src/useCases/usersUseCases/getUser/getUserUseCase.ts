import { UserProps } from '@entities/user'
import { IUsersRepository } from '@repositories/IUsersRepository'

export interface IGetUserUseCase {
  execute(id: string): Promise<Omit<UserProps, 'password'>>
}

export const GetUserUseCase = (usersRepository: IUsersRepository) => {
  const execute = async (id: string) => {
    if (!id) throw new Error('No id provided')

    const { name, lastName, email } = await usersRepository.getUserById(id)

    if (!name) throw new Error('User not found')

    return {
      id,
      name,
      lastName,
      email
    }
  }

  return Object.freeze({ execute })
}
