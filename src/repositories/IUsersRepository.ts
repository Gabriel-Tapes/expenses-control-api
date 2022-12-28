import { User, UserProps } from '../entities/user'

export interface editUserDTO {
  id: string
  name?: string
  lastName?: string
  password?: string
}

export interface IUsersRepository {
  getUserPassword(email: string): Promise<string | null>
  createUser(user: User): Promise<void>
  getUserById(userId: string): Promise<Omit<UserProps, 'password'> | null>
  getUserByEmail(userEmail: string): Promise<Omit<UserProps, 'password'> | null>
  editUser({
    id,
    name,
    lastName,
    password
  }: editUserDTO): Promise<Omit<UserProps, 'password'>>
  deleteUser(userId: string): Promise<void>
}
