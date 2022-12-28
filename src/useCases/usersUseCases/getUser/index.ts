import { PostgresUsersRepository } from '@repositories/implementations/postgresUsersRepository'
import { GetUserController } from './getUserController'
import { GetUserUseCase } from './getUserUseCase'

const usersRepository = PostgresUsersRepository()
const getUserUseCase = GetUserUseCase(usersRepository)
const getUserController = GetUserController(getUserUseCase)

export { getUserController }
