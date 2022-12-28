import { UserProps } from '@entities/user'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { IEditUserDTO } from './IEditUserDTO'

export interface IEditUserUseCase {
  execute({
    id,
    name,
    lastName,
    password
  }: IEditUserDTO): Promise<Omit<UserProps, 'password'>>
}

export const EditUserUseCase = (
  usersRepository: IUsersRepository
): IEditUserUseCase => {
  const execute = async ({
    id,
    name,
    lastName,
    password
  }: IEditUserDTO): Promise<Omit<UserProps, 'password'>> => {
    const oldUser = await usersRepository.getUserById(id)

    if (!oldUser) throw new Error('Edit User error: user not found')

    if (!(name || lastName || password)) return oldUser

    const editedUser = await usersRepository.editUser({
      id,
      name,
      lastName,
      password
    })

    return editedUser
  }

  return Object.freeze({ execute })
}
