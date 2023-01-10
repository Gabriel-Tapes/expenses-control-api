import 'dotenv/config'
import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository'
import { CreateUserUseCase } from './createUserUseCase'

describe('Create User use case tests', () => {
  it('should be able to create an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const createUserUseCase = CreateUserUseCase(usersRepository)

    const { user, token } = await createUserUseCase.execute({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    expect(user).toBeTruthy()
    expect(token).toBeTruthy()
  })

  it('should not to be able to create more then one user with a same email', async () => {
    const usersRepository = InMemoryUsersRepository()
    const createUserUseCase = CreateUserUseCase(usersRepository)

    await createUserUseCase.execute({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    expect(async () => {
      return await createUserUseCase.execute({
        name: 'Joe',
        lastName: 'Doe',
        email: 'joe.doe@exemple.com',
        password: '123456'
      })
    }).rejects.toThrow()
  })
})
