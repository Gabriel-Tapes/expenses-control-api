import { PostgresExpensesRepository } from '@repositories/implementations/postgresExpensesRepository'
import { GetExpenseUseCase } from './getExpenseUseCase'
import { GetExpenseController } from './getExpenseController'

const expensesRepository = PostgresExpensesRepository()
const getExpenseUseCase = GetExpenseUseCase(expensesRepository)
const getExpenseController = GetExpenseController(getExpenseUseCase)

export { getExpenseController }
