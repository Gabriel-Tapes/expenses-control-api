import { PostgresUsersRepository } from '@repositories/implementations/postgresUsersRepository'
import { DeleteUserController } from './deleteUserController'
import { DeleteUserUseCase } from './deleteUserUseCase'

const usersRepository = PostgresUsersRepository()
const deleteUserUseCase = DeleteUserUseCase(usersRepository)
const deleteUserController = DeleteUserController(deleteUserUseCase)

export { deleteUserController }
