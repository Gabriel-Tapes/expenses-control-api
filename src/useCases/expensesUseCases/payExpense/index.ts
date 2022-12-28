import { PostgresExpensesRepository } from '@repositories/implementations/postgresExpensesRepository'
import { PayExpenseUseCase } from './payExpenseUseCase'
import { PayExpenseController } from './payExpenseController'

const expensesRepository = PostgresExpensesRepository()
const payExpenseUseCase = PayExpenseUseCase(expensesRepository)
const payExpenseController = PayExpenseController(payExpenseUseCase)

export { payExpenseController }
