import 'dotenv/config'
import { sign } from 'jsonwebtoken'
import {
  AuthMiddlewareUseCase,
  IAuthMiddlewareUseCase
} from './authMiddlewareUseCase'

describe('Auth middleware use case tests', () => {
  let authMiddlewareUseCase: IAuthMiddlewareUseCase

  beforeEach(() => {
    authMiddlewareUseCase = AuthMiddlewareUseCase()
  })

  test('should throw an error if token is not in the correct format', () => {
    expect(() =>
      authMiddlewareUseCase.execute('invalid token format')
    ).toThrowError('No valid token parts')
  })

  test('should throw an error if scheme is not Bearer', () => {
    expect(() => authMiddlewareUseCase.execute('notBearer token')).toThrowError(
      'Token malformatted, no Bearer.'
    )
  })

  test('should throw an error if token is invalid', () => {
    const processEnv = { ...process.env }
    process.env.JWTSECRET = 'secret'
    expect(() => authMiddlewareUseCase.execute('Bearer invalidToken')).toThrow()
    process.env = processEnv
  })

  test('should return the id from the token payload', () => {
    const processEnv = { ...process.env }
    process.env.JWTSECRET = 'secret'

    const validToken = sign({ id: 'userId' }, process.env.JWTSECRET, {
      expiresIn: 3 * 60 // 3 minutes
    })

    const id = authMiddlewareUseCase.execute(`Bearer ${validToken}`)

    expect(id).toBe('userId')
    process.env = processEnv
  })
})
