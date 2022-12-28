import { PostgresExpensesRepository } from '@repositories/implementations/postgresExpensesRepository'
import { DeleteExpenseUseCase } from './deleteExpenseUseCase'
import { DeleteExpenseController } from './deleteExpenseController'

const expensesRepository = PostgresExpensesRepository()
const deleteExpenseUseCase = DeleteExpenseUseCase(expensesRepository)
const deleteExpenseController = DeleteExpenseController(deleteExpenseUseCase)

export { deleteExpenseController }
