import { PostgresUsersRepository } from '@repositories/implementations/postgresUsersRepository'
import { EditUserController } from './editUserController'
import { EditUserUseCase } from './editUserUseCase'

const usersRepository = PostgresUsersRepository()
const editUserUseCase = EditUserUseCase(usersRepository)
const editUserController = EditUserController(editUserUseCase)

export { editUserController }
