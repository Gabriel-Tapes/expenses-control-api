import 'dotenv/config'
import { AuthenticateUserUseCase } from './authenticateUserUseCase'
import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository'
import { User } from '@entities/user'

describe('Authenticate user use case tests', () => {
  it('should be able to authenticate an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const authenticateUserUseCase = AuthenticateUserUseCase(usersRepository)

    const newUser = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(newUser)

    const { user, token } = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password
    })

    expect(user).toBeTruthy()
    expect(token).toBeTruthy()
  })

  it('should not be able to authenticate an user with an invalid email', async () => {
    const usersRepository = InMemoryUsersRepository()
    const authenticateUserUseCase = AuthenticateUserUseCase(usersRepository)

    const newUser = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(newUser)

    await expect(async () => {
      return await authenticateUserUseCase.execute({
        email: 'any invalid email',
        password: newUser.password
      })
    }).rejects.toThrow()
  })

  it('should not be able to authenticate an user with an invalid password', async () => {
    const usersRepository = InMemoryUsersRepository()
    const authenticateUserUseCase = AuthenticateUserUseCase(usersRepository)

    const user = new User({
      name: 'Mark',
      lastName: 'Zuckerberg',
      email: 'mark@meta.com',
      password: 'aliens123456querty.,@#$%'
    })

    await usersRepository.createUser(user)

    await expect(async () => {
      return authenticateUserUseCase.execute({
        email: user.email,
        password: 'An invalid password'
      })
    }).rejects.toThrow('Authenticate User Error: Invalid Password')
  })
})
