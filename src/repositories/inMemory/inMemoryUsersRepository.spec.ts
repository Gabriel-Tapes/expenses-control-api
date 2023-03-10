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

  it('should be able to get an user by id', async () => {
    const usersRepository = InMemoryUsersRepository()
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

  it('should not be able to get an user with an invalid id', async () => {
    const usersRepository = InMemoryUsersRepository()

    const gottenUser = await usersRepository.getUserById('invalid id')

    expect(gottenUser).toBeNull()
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

    const gottenUser = await usersRepository.getUserByEmail(user.email)

    expect(gottenUser).toBeTruthy()
  })

  it('should not be able to get an user with an invalid email', async () => {
    const usersRepository = InMemoryUsersRepository()

    const gottenUser = await usersRepository.getUserByEmail(
      'invalid@invalid.com'
    )

    expect(gottenUser).toBeNull()
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

    expect(editedUser).toBeTruthy()
    expect(editedUser.name).toEqual(editUserData.name)
    expect(editedUser.lastName).toEqual(editUserData.lastName)
    expect(editedUser.email).toEqual(user.email)
    expect(editedUser.password).toEqual(editUserData.password)
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

    const gottenUser = await usersRepository.getUserById(user.id)

    expect(gottenUser).toBeNull()
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

    const gottenUser = await usersRepository.getUserById(user.id)

    expect(gottenUser).toBeTruthy()
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

    const savedUser = await usersRepository.getUserById(user.id)

    expect(savedUser.password).not.toEqual(user.password)
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

    const savedUser = await usersRepository.getUserById(user.id)

    expect(savedUser.password).not.toEqual(user.password)
  })
})
