import { InMemoryUsersRepository } from './inMemoryUsersRepository'
import { User } from '@entities/user'

describe('In memory users repository tests', () => {
  it('should be able to create an user', async () => {
    const usersRepository = InMemoryUsersRepository()
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

  it('should be able to get a password with a valid user email', async () => {
    const usersRepository = InMemoryUsersRepository()
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const password = await usersRepository.getUserPassword(user.email)

    expect(password).toBeTruthy()
  })

  it('should not be able to get a password with an invalid user email', async () => {
    const usersRepository = InMemoryUsersRepository()
    const password = await usersRepository.getUserPassword(
      'invalidEmail@invalid.com'
    )

    expect(password).toBeNull()
  })

  it('should be able to get an user by id', async () => {
    const usersRepository = InMemoryUsersRepository()
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const gettedUser = await usersRepository.getUserById(user.id)

    expect(gettedUser).toBeTruthy()
  })

  it('should not be able to get an user with an invalid id', async () => {
    const usersRepository = InMemoryUsersRepository()

    const gettedUser = await usersRepository.getUserById('invalid id')

    expect(gettedUser).toBeNull()
  })

  it('should be able to get an user by email', async () => {
    const usersRepository = InMemoryUsersRepository()
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const gettedUser = await usersRepository.getUserByEmail(user.email)

    expect(gettedUser).toBeTruthy()
  })

  it('should not be able to get an user with an invalid email', async () => {
    const usersRepository = InMemoryUsersRepository()

    const gettedUser = await usersRepository.getUserByEmail(
      'invalid@invalid.com'
    )

    expect(gettedUser).toBeNull()
  })

  it('should be able to edit an user', async () => {
    const usersRepository = InMemoryUsersRepository()
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
    const editedUserPassword = await usersRepository.getUserPassword(
      editedUser.email
    )

    expect(editedUser).toBeTruthy()
    expect(editedUser.name).toEqual(editUserData.name)
    expect(editedUser.lastName).toEqual(editUserData.lastName)
    expect(editedUser.email).toEqual(user.email)
    expect(editedUserPassword).toEqual(editUserData.password)
  })

  it('should not be able to edit an user with invalid id given', async () => {
    const usersRepository = InMemoryUsersRepository()
    const editedUser = await usersRepository.editUser({ id: 'invalid id' })

    expect(editedUser).toBeNull()
  })

  it('should be able to delete an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    await usersRepository.deleteUser(user.id)

    const gettedUser = await usersRepository.getUserById(user.id)

    expect(gettedUser).toBeNull()
  })

  it('should not be able to delete an user with an invalid id given', async () => {
    const usersRepository = InMemoryUsersRepository()
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    await usersRepository.deleteUser('invalid id')

    const gettedUser = await usersRepository.getUserById(user.id)

    expect(gettedUser).toBeTruthy()
  })

  it('should be the created user password to be a hash', async () => {
    const usersRepository = InMemoryUsersRepository()
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const archivedPassword = await usersRepository.getUserPassword(user.email)

    expect(archivedPassword).not.toEqual(user.password)
  })

  it('should be the created user password is not saves directly', async () => {
    const usersRepository = InMemoryUsersRepository()
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const archivedPassword = await usersRepository.getUserPassword(user.email)

    expect(archivedPassword).not.toEqual(user.password)
  })
})
