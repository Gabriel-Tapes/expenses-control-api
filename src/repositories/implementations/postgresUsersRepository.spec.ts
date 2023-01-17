import { newDb } from 'pg-mem'
import { PostgresUsersRepository } from './postgresUsersRepository'
import { User } from '@entities/user'
import { runMigrations } from '@database/runMigrations'

jest.mock('@database/connectDatabase', () => ({
  createDatabaseConnection: jest.fn(async () => {
    const { Pool } = newDb().adapters.createPg()

    const connection = new Pool()
    await runMigrations(connection)

    return connection
  })
}))

describe('Postgres Users Repository tests', () => {
  const notFoundId = '5e543f3f-3f5e-4040-a2a2-7979ccccdddd'
  let usersRepository: ReturnType<typeof PostgresUsersRepository>

  beforeEach(() => {
    usersRepository = PostgresUsersRepository()
  })

  it('should be able to create an user', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const createdUser = await usersRepository.getUserById(user.id)

    expect(createdUser).toBeInstanceOf(User)
    expect(createdUser.id).toEqual(user.id)
  })

  it('should be able to get an user by id', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const gottenUser = await usersRepository.getUserById(user.id)

    expect(gottenUser).toBeTruthy()
  })

  it('should not be able to get an user with an invalid or not found id', async () => {
    const gottenUser = await usersRepository.getUserById('an invalid id')
    const notFoundUser = await usersRepository.getUserById(notFoundId)

    expect(gottenUser).toBeNull()
    expect(notFoundUser).toBeNull()
  })

  it('should be able to get an user by email', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const gottenUser = await usersRepository.getUserByEmail(user.email)

    expect(gottenUser).toBeTruthy()
  })

  it('should not be able to get an user with an invalid email', async () => {
    const gottenUser = await usersRepository.getUserByEmail(
      'invalid@invalid.com'
    )

    expect(gottenUser).toBeNull()
  })

  it('should be able to edit an user', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const editUserData = {
      id: user.id,
      name: 'Mark',
      lastName: 'Zuckerberg',
      password: 'aliens1234'
    }

    const editedUser = await usersRepository.editUser(editUserData)

    expect(editedUser).toBeTruthy()
    expect(editedUser.name).toEqual(editUserData.name)
    expect(editedUser.lastName).toEqual(editUserData.lastName)
    expect(editedUser.email).toEqual(user.email)
  })

  it('should not be able to edit an user with invalid id given', async () => {
    const editedUser = await usersRepository.editUser({ id: notFoundId })

    expect(editedUser).toBeNull()
  })

  it('should be able to delete an user', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    await usersRepository.deleteUser(user.id)

    const gottenUser = await usersRepository.getUserById(user.id)

    expect(gottenUser).toBeNull()
  })

  it('should not be able to delete an user with an invalid id given', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    await usersRepository.deleteUser(notFoundId)

    const gottenUser = await usersRepository.getUserById(user.id)

    expect(gottenUser).toBeTruthy()
  })

  it('should be the created user password to be a hash', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const savedUser = await usersRepository.getUserById(user.id)

    expect(savedUser.password).not.toEqual(user.password)
  })

  it('should be the created user password is not saves directly', async () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const savedUser = await usersRepository.getUserById(user.id)

    expect(savedUser.password).not.toEqual(user.password)
  })
})
