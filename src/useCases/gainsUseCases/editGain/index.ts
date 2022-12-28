import { PostgresGainsRepository } from '@repositories/implementations/postgresGainsRepository'
import { EditGainController } from './editGainController'
import { EditGainUseCase } from './editGainUseCase'

const gainsRepository = PostgresGainsRepository()
const editGainUseCase = EditGainUseCase(gainsRepository)
const editGainController = EditGainController(editGainUseCase)

export { editGainController }
