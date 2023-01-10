import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository'
import { GetUserUseCase } from './getUserUseCase'
import { User } from '@entities/user'

describe('Get User use case tests', () => {
  it('should be able to get an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const getUserUseCase = GetUserUseCase(usersRepository)

    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@gmail.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    const gottenUser = await getUserUseCase.execute(user.id)

    expect(gottenUser).toBeTruthy()
    expect({
      id: gottenUser.id,
      name: gottenUser.name,
      lastName: gottenUser.lastName,
      email: gottenUser.email
    }).toEqual({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email
    })
  })

  it('should not be able to get an user with an blank id', async () => {
    const usersRepository = InMemoryUsersRepository()
    const getUserUseCase = GetUserUseCase(usersRepository)

    expect(async () => {
      return await getUserUseCase.execute('')
    }).rejects.toThrow('No id provided')
  })

  it('should not be able to get an user with an invalid id', async () => {
    const usersRepository = InMemoryUsersRepository()
    const getUserUseCase = GetUserUseCase(usersRepository)

    expect(async () => {
      return await getUserUseCase.execute('An invalid ID')
    }).rejects.toThrow('User not found')
  })
})
