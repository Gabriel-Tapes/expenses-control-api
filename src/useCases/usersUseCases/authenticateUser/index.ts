import { PostgresUsersRepository } from '@repositories/implementations/postgresUsersRepository'
import { AuthenticateUserUseCase } from './authenticateUserUseCase'
import { AuthenticateUserController } from './authenticateUserController'

const usersRepository = PostgresUsersRepository()
const authenticateUserUseCase = AuthenticateUserUseCase(usersRepository)
const authenticateUserController = AuthenticateUserController(
  authenticateUserUseCase
)

export { authenticateUserController }
