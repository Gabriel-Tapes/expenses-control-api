import { PostgresExpensesRepository } from '@repositories/implementations/postgresExpensesRepository'
import { RegisterExpenseController } from './registerExpenseController'
import { RegisterExpenseUseCase } from './registerExpenseUseCase'

const expensesRepository = PostgresExpensesRepository()
const registerExpenseUseCase = RegisterExpenseUseCase(expensesRepository)
const registerExpenseController = RegisterExpenseController(
  registerExpenseUseCase
)

export { registerExpenseController }
