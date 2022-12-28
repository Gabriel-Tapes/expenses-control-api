import { PostgresExpensesRepository } from '@repositories/implementations/postgresExpensesRepository'
import { EditExpenseUseCase } from './editExpenseUseCase'
import { EditExpenseController } from './editExpenseController'

const expensesRepository = PostgresExpensesRepository()
const editExpenseUseCase = EditExpenseUseCase(expensesRepository)
const editExpenseController = EditExpenseController(editExpenseUseCase)

export { editExpenseController }
