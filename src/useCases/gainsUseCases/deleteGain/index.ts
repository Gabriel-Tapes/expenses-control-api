import { PostgresGainsRepository } from '@repositories/implementations/postgresGainsRepository'
import { DeleteGainController } from './deleteGainController'
import { DeleteGainUseCase } from './deleteGainUseCase'

const gainsRepository = PostgresGainsRepository()
const deleteGainUseCase = DeleteGainUseCase(gainsRepository)
const deleteGainController = DeleteGainController(deleteGainUseCase)

export { deleteGainController }
