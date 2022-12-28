import { PostgresUsersRepository } from '@repositories/implementations/postgresUsersRepository'
import { CreateUserController } from './createUserController'
import { CreateUserUseCase } from './createUserUseCase'

const usersRepository = PostgresUsersRepository()
const createUserUseCase = CreateUserUseCase(usersRepository)
const createUserController = CreateUserController(createUserUseCase)

export { createUserController }
