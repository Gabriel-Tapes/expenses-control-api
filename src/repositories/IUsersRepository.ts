import { User } from '../entities/user'

export interface editUserDTO {
  id: string
  name?: string
  lastName?: string
  password?: string
}

export interface IUsersRepository {
  createUser(user: User): Promise<void>
  getUserById(userId: string): Promise<User | null>
  getUserByEmail(userEmail: string): Promise<User | null>
  editUser({ id, name, lastName, password }: editUserDTO): Promise<User>
  deleteUser(userId: string): Promise<void>
}
