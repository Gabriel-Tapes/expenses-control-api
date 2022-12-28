import { PostgresGainsRepository } from '@repositories/implementations/postgresGainsRepository'
import { RegisterGainController } from './registerGainController'
import { RegisterGainUseCase } from './registerGainUseCase'

const gainsRepository = PostgresGainsRepository()
const registerGainUseCase = RegisterGainUseCase(gainsRepository)
const registerGainController = RegisterGainController(registerGainUseCase)

export { registerGainController }
