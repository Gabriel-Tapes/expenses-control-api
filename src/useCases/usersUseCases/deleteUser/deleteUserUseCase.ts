import { IUsersRepository } from '@repositories/IUsersRepository'

export interface IDeleteUserUseCase {
  execute(id: string): Promise<void>
}

export const DeleteUserUseCase = (
  usersRepository: IUsersRepository
): IDeleteUserUseCase => {
  const execute = async (id: string): Promise<void> => {
    const user = await usersRepository.getUserById(id)

    if (!user) throw new Error('User not found')

    await usersRepository.deleteUser(id)
  }

  return Object.freeze({ execute })
}
