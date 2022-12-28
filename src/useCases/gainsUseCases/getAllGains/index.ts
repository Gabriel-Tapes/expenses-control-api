import { PostgresGainsRepository } from '@repositories/implementations/postgresGainsRepository'
import { GetAllGainsController } from './getAllGainsController'
import { GetAllGainsUseCase } from './getAllGainsUseCase'

const gainsRepository = PostgresGainsRepository()
const getAllGainsUseCase = GetAllGainsUseCase(gainsRepository)
const getAllGainsController = GetAllGainsController(getAllGainsUseCase)

export { getAllGainsController }
