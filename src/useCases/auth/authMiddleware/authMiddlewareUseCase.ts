import { verify } from 'jsonwebtoken'

interface IPayloadJWT {
  id: string
  iad: number
  exp: number
}

export interface IAuthMiddlewareUseCase {
  execute(token: string): string
}

export const AuthMiddlewareUseCase = () => {
  const execute = (token: string): string => {
    const tokenParts = token.split(' ')

    if (!(tokenParts.length === 2)) throw new Error('No valid token parts')

    const [scheme, tokenValue] = tokenParts

    if (!/^Bearer$/i.test(scheme))
      throw new Error('Token malformatted, no Bearer.')

    try {
      const { id } = verify(tokenValue, process.env.JWTSECRET) as IPayloadJWT
      return id
    } catch (err) {
      throw new Error(err.message)
    }
  }

  return Object.freeze({ execute })
}
