import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository'
import { DeleteUserUseCase } from './deleteUserUseCase'
import { User } from '@entities/user'

describe('Delete User use case tests', () => {
  it('should be able to delete an user', async () => {
    const usersRepository = InMemoryUsersRepository()
    const deleteUserUseCase = DeleteUserUseCase(usersRepository)

    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@exemple.com',
      password: '123456'
    })

    await usersRepository.createUser(user)

    await expect(async () => {
      return await deleteUserUseCase.execute(user.id)
    }).not.toThrow()

    const deletedUser = await usersRepository.getUserById(user.id)
    expect(deletedUser).toBeNull()
  })

  it('should not be able to delete an user if him not exists', () => {
    const usersRepository = InMemoryUsersRepository()
    const deleteUserUseCase = DeleteUserUseCase(usersRepository)

    expect(async () => {
      return await deleteUserUseCase.execute('An invalid id')
    }).rejects.toThrow()
  })
})
