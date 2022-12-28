import { AuthMiddlewareController } from './authMiddlewareController'
import { AuthMiddlewareUseCase } from './authMiddlewareUseCase'

const authMiddlewareUseCase = AuthMiddlewareUseCase()
const authMiddlewareController = AuthMiddlewareController(authMiddlewareUseCase)

export { authMiddlewareController }
