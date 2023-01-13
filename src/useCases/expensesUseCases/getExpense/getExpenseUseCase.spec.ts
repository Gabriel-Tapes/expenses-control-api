import { Expense } from '@entities/expense'
import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { InMemoryExpensesRepository } from '@repositories/inMemory/inMemoryExpensesRepository'
import { GetExpenseUseCase, IGetExpenseUseCase } from './getExpenseUseCase'

describe('Get Expense use case tests', () => {
  let expensesRepository: IExpenseRepository
  let getExpenseUseCase: IGetExpenseUseCase

  const userId = 'userId'
  const expense = new Expense({
    description: 'test expense',
    cost: 50,
    paid: false
  })

  beforeAll(async () => {
    expensesRepository = InMemoryExpensesRepository()

    await expensesRepository.createExpense(userId, expense)

    getExpenseUseCase = GetExpenseUseCase(expensesRepository)
  })

  it('should be able to get an expense with matching user and expense ids', async () => {
    const gottenExpense = await getExpenseUseCase.execute({
      ownerId: userId,
      expenseId: expense.id
    })

    expect(gottenExpense).toBeTruthy()
    expect(gottenExpense).toEqual(expense)
  })

  it('should return null if a non-matching user id is provided', async () => {
    const gottenExpense = await getExpenseUseCase.execute({
      ownerId: 'non-matching user id',
      expenseId: expense.id
    })

    expect(gottenExpense).toBeNull()
  })

  it('should return null if a non-matching expense id is provided', async () => {
    const gottenExpense = await getExpenseUseCase.execute({
      ownerId: userId,
      expenseId: 'non-matching expense id'
    })

    expect(gottenExpense).toBeNull()
  })
})
