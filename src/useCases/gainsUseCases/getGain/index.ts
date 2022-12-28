import { PostgresGainsRepository } from '@repositories/implementations/postgresGainsRepository'
import { GetGainController } from './getGainController'
import { GetGainUseCase } from './getGainUseCase'

const gainsRepository = PostgresGainsRepository()
const getGainUseCase = GetGainUseCase(gainsRepository)
const getGainController = GetGainController(getGainUseCase)

export { getGainController }
