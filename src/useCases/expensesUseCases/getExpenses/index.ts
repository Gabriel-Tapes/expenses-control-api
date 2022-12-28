import { PostgresExpensesRepository } from '@repositories/implementations/postgresExpensesRepository'
import { GetExpensesUseCase } from './getExpensesUseCase'
import { GetExpensesController } from './getExpensesController'

const expensesRepository = PostgresExpensesRepository()
const getExpensesUseCase = GetExpensesUseCase(expensesRepository)
const getExpensesController = GetExpensesController(getExpensesUseCase)

export { getExpensesController }
