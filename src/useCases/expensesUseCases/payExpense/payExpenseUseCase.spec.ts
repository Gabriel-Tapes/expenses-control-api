import { Expense } from '@entities/expense'
import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { InMemoryExpensesRepository } from '@repositories/inMemory/inMemoryExpensesRepository'
import { IPayExpenseUseCase, PayExpenseUseCase } from './payExpenseUseCase'

describe('Pay Expense use case tests', () => {
  let expensesRepository: IExpenseRepository
  let payExpenseUseCase: IPayExpenseUseCase

  const userId = 'userId'
  const expense = new Expense({
    description: 'test expense',
    cost: 50,
    paid: false
  })

  beforeEach(async () => {
    expensesRepository = InMemoryExpensesRepository()

    await expensesRepository.createExpense(
      userId,
      new Expense(
        {
          description: expense.description,
          cost: expense.cost,
          paid: expense.paid
        },
        expense.id
      )
    )

    payExpenseUseCase = PayExpenseUseCase(expensesRepository)
  })

  it('should be able to pay an expense with matching user and expense ids', async () => {
    const paidExpense = await payExpenseUseCase.execute({
      ownerId: userId,
      expenseId: expense.id
    })

    expect(paidExpense).toBeTruthy()
    expect(paidExpense.paid).toBe(true)
    expect(paidExpense.paidAt).toBeTruthy()
    expect(paidExpense.paidAt).toBeInstanceOf(Date)
  })

  it('should return null if an non-matching user id is provided', async () => {
    const paidExpense = await payExpenseUseCase.execute({
      ownerId: 'non-matching user id',
      expenseId: expense.id
    })

    expect(paidExpense).toBeNull()
  })

  it('should return null if an non-matching expense id is provided', async () => {
    const paidExpense = await payExpenseUseCase.execute({
      ownerId: userId,
      expenseId: 'non-matching expense id'
    })

    expect(paidExpense).toBeNull()
  })
})
