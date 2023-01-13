import { Expense } from '@entities/expense'
import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { InMemoryExpensesRepository } from '@repositories/inMemory/inMemoryExpensesRepository'
import {
  DeleteExpenseUseCase,
  IDeleteExpenseUseCase
} from './deleteExpenseUseCase'

describe('Delete Expense use case tests', () => {
  let expensesRepository: IExpenseRepository
  let deleteExpenseUseCase: IDeleteExpenseUseCase

  const userId = 'userId'
  const expense = new Expense({
    description: 'test expense',
    cost: 50,
    paid: false
  })

  beforeEach(async () => {
    expensesRepository = InMemoryExpensesRepository()

    await expensesRepository.createExpense(userId, expense)

    deleteExpenseUseCase = DeleteExpenseUseCase(expensesRepository)
  })

  it('should be able to delete an expense with matching user and expense ids', async () => {
    await deleteExpenseUseCase.execute(userId, expense.id)

    expect(
      await expensesRepository.getExpenseById(userId, expense.id)
    ).toBeNull()
  })

  it('should not be able to delete an expense with matching user id', async () => {
    await deleteExpenseUseCase.execute(userId, expense.id)

    await expect(async () => {
      return await deleteExpenseUseCase.execute(
        'non-matching user id',
        expense.id
      )
    }).rejects.toThrow()
  })

  it('should not be able to delete an expense with non-matching expense id', async () => {
    await expect(async () => {
      return await deleteExpenseUseCase.execute(
        userId,
        'non-matching expense id'
      )
    }).rejects.toThrow()
  })
})
