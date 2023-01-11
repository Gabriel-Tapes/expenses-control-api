import { IUsersRepository, editUserDTO } from '@repositories/IUsersRepository'
import { Pool } from 'pg'
import { createDatabaseConnection } from '@database/connectDatabase'
import { User } from '@entities/user'
import { hash } from 'bcrypt'

export const PostgresUsersRepository = (): IUsersRepository => {
  let client: Pool

  const connectDatabase = async () => {
    if (!client) client = await createDatabaseConnection()
  }

  const createUser = async (user: User): Promise<void> => {
    await connectDatabase()

    const passwordHash = await hash(user.password, 10)

    await client.query(
      'INSERT INTO USERS (ID, NAME, LAST_NAME, EMAIL, PASSWORD) VALUES ($1, $2, $3, $4, $5)',
      [user.id, user.name, user.lastName, user.email, passwordHash]
    )
  }

  const getUserById = async (id: string): Promise<User | null> => {
    await connectDatabase()

    const validUuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

    if (!id.match(validUuidRegex)) return null

    const { rows } = await client.query('SELECT * FROM USERS WHERE ID = $1', [
      id
    ])

    if (!rows.length) return null

    const { name, last_name: lastName, email, password } = rows[0]

    return new User(
      {
        name,
        lastName,
        email,
        password
      },
      id
    )
  }

  const getUserByEmail = async (email: string): Promise<User | null> => {
    await connectDatabase()

    const { rows } = await client.query(
      'SELECT * FROM USERS WHERE EMAIL = $1',
      [email]
    )

    if (!rows.length) return null

    const { id, name, last_name: lastName, password } = rows[0]

    return new User(
      {
        name,
        lastName,
        email,
        password
      },
      id
    )
  }

  const editUser = async ({
    id,
    name,
    lastName,
    password
  }: editUserDTO): Promise<User> => {
    await connectDatabase()

    const oldUser = await getUserById(id)

    if (!oldUser) return null

    const passwordHash = password ? await hash(password, 10) : oldUser.password

    const editedUser = new User({
      name: name ?? oldUser.name,
      lastName: lastName ?? oldUser.lastName,
      email: oldUser.email,
      password: passwordHash
    })

    client.query(
      'UPDATE USERS SET NAME = $2, LAST_NAME = $3, PASSWORD = $4 WHERE ID = $1',
      [editedUser.id, editedUser.name, editedUser.lastName, passwordHash]
    )

    return editedUser
  }

  const deleteUser = async (userId: string): Promise<void> => {
    await connectDatabase()

    await client.query('DELETE FROM USERS WHERE ID = $1', [userId])
  }

  return Object.freeze({
    createUser,
    getUserById,
    getUserByEmail,
    editUser,
    deleteUser
  })
}
