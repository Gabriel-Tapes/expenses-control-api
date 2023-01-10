import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository'
import { EditUserUseCase } from './editUserUseCase'
import { User } from '@entities/user'

describe('Edit User use case tests', () => {
  it('should be able to edit an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const editUserUseCase = EditUserUseCase(usersRepository)

    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const editedUser = await editUserUseCase.execute({
      id: user.id,
      name: 'John',
      lastName: 'Does',
      password: 'pass123456'
    })

    expect(editedUser).toBeTruthy()
    expect(editedUser.id).toEqual(user.id)
    expect(editedUser.email).toEqual(user.email)
    expect(editedUser).not.toEqual(user)
  })

  it('should be able to edit only the name property from an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const editUserUseCase = EditUserUseCase(usersRepository)

    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const editedUser = await editUserUseCase.execute({
      id: user.id,
      name: 'John'
    })

    expect(editedUser).toBeTruthy()
    expect(editedUser.id).toEqual(user.id)
    expect(editedUser.email).toEqual(user.email)
    expect(editedUser.name).not.toEqual(user.name)
  })

  it('should be able to edit only the lastName property from an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const editUserUseCase = EditUserUseCase(usersRepository)

    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const editedUser = await editUserUseCase.execute({
      id: user.id,
      lastName: 'does'
    })

    expect(editedUser).toBeTruthy()
    expect(editedUser.id).toEqual(user.id)
    expect(editedUser.email).toEqual(user.email)
    expect(editedUser.lastName).not.toEqual(user.lastName)
  })

  it('should be able to edit only the password property from an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const editUserUseCase = EditUserUseCase(usersRepository)

    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const editedUser = await editUserUseCase.execute({
      id: user.id,
      password: 'pass123456'
    })

    expect(editedUser).toBeTruthy()
    expect(editedUser.id).toEqual(user.id)
    expect(editedUser.email).toEqual(user.email)
    expect(editedUser.password).not.toEqual(user.password)
  })

  it('should not be the user edited when neither property is had been set', async () => {
    const usersRepository = InMemoryUsersRepository()
    const editUserUseCase = EditUserUseCase(usersRepository)

    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const editedUser = await editUserUseCase.execute({
      id: user.id
    })

    expect(editedUser).toBeTruthy()
    expect({
      id: editedUser.id,
      email: editedUser.email,
      name: editedUser.name,
      lastName: editedUser.lastName
    }).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName
    })
  })

  it('should not be able to edit an user with an invalid id', async () => {
    const usersRepository = InMemoryUsersRepository()
    const editUserUseCase = EditUserUseCase(usersRepository)

    expect(async () => {
      return await editUserUseCase.execute({
        id: 'An invalid ID',
        name: 'John',
        lastName: 'does',
        password: 'new password'
      })
    }).rejects.toThrow()
  })
})
