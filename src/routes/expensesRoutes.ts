import { authMiddlewareController } from '@useCases/auth/authMiddleware'
import { deleteExpenseController } from '@useCases/expensesUseCases/deleteExpense'
import { editExpenseController } from '@useCases/expensesUseCases/editExpense'
import { getExpenseController } from '@useCases/expensesUseCases/getExpense'
import { getExpensesController } from '@useCases/expensesUseCases/getExpenses'
import { payExpenseController } from '@useCases/expensesUseCases/payExpense'
import { registerExpenseController } from '@useCases/expensesUseCases/registerExpense'
import { Router } from 'express'

export const expensesRouter = Router()

expensesRouter.use((req, res, next) => {
  authMiddlewareController.handle(req, res, next)
})

expensesRouter.post('/', (req, res) => {
  return registerExpenseController.handle(req, res)
})

expensesRouter.get('/', (req, res) => {
  if (req.query.id) return getExpenseController.handle(req, res)

  return getExpensesController.handle(req, res)
})

expensesRouter.patch('/', (req, res) => {
  return payExpenseController.handle(req, res)
})

expensesRouter.put('/', (req, res) => {
  return editExpenseController.handle(req, res)
})

expensesRouter.delete('/', (req, res) => {
  deleteExpenseController.handle(req, res)
})
