import { User } from '@entities/user'
import { IUsersRepository, editUserDTO } from '@repositories/IUsersRepository'
import { hash } from 'bcrypt'

export const InMemoryUsersRepository = (): IUsersRepository => {
  let users: User[] = []

  const createUser = async (user: User): Promise<void> => {
    users.push(
      new User(
        {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          password: await hash(user.password, 10)
        },
        user.id
      )
    )
  }
  const getUserById = async (userId: string): Promise<User | null> => {
    return users.find(user => user.id === userId) || null
  }
  const getUserByEmail = async (userEmail: string): Promise<User | null> => {
    return users.find(user => user.email === userEmail) || null
  }
  const editUser = async ({
    id,
    name,
    lastName,
    password
  }: editUserDTO): Promise<User | null> => {
    const user = await getUserById(id)

    if (!user) return null

    user.name = name ?? user.name
    user.lastName = lastName ?? user.lastName
    user.password = password ?? user.password

    return user
  }
  const deleteUser = async (userId: string): Promise<void> => {
    users = users.filter(user => user.id !== userId)
  }

  return Object.freeze({
    createUser,
    getUserById,
    getUserByEmail,
    editUser,
    deleteUser
  })
}
