import { Expense } from '@entities/expense'
import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { InMemoryExpensesRepository } from '@repositories/inMemory/inMemoryExpensesRepository'
import { EditExpenseUseCase, IEditExpenseUseCase } from './editExpenseUseCase'

describe('Edit Expense use case tests', () => {
  let expensesRepository: IExpenseRepository
  let editExpenseUseCase: IEditExpenseUseCase

  const userId = 'userId'
  const expense = new Expense({
    description: 'test expense',
    cost: 50,
    paid: true
  })

  beforeEach(async () => {
    expensesRepository = InMemoryExpensesRepository()

    await expensesRepository.createExpense(
      userId,
      new Expense(
        {
          description: expense.description,
          cost: expense.cost,
          paid: expense.paid,
          paidAt: expense.paidAt
        },
        expense.id
      )
    )

    editExpenseUseCase = EditExpenseUseCase(expensesRepository)
  })

  it('should be able to edit an expense with all data and matching user and expense ids', async () => {
    const editedExpense = await editExpenseUseCase.execute({
      ownerId: userId,
      expenseId: expense.id,
      description: 'edited test expense',
      cost: 60,
      paid: false,
      paidAt: null
    })

    expect(editedExpense).toBeTruthy()
    expect(editedExpense).not.toEqual(expense)
    expect(editedExpense.description).toBe('edited test expense')
    expect(editedExpense.cost).toBe(60)
    expect(editedExpense.paid).toBe(false)
    expect(editedExpense.paidAt).toBeNull()
  })

  it('should return null if a non-matching user id is provided', async () => {
    const editedExpense = await editExpenseUseCase.execute({
      ownerId: 'non-matching user id',
      expenseId: expense.id,
      description: 'edited test expense',
      cost: 60,
      paid: false,
      paidAt: null
    })

    expect(editedExpense).toBeNull()
  })

  it('should return null if a non-matching expense id is provided', async () => {
    const editedExpense = await editExpenseUseCase.execute({
      ownerId: userId,
      expenseId: 'non-matching expense id',
      description: 'edited test expense',
      cost: 60,
      paid: false,
      paidAt: null
    })

    expect(editedExpense).toBeNull()
  })

  it('should be able to edit only description field of an expense', async () => {
    const editedExpense = await editExpenseUseCase.execute({
      ownerId: userId,
      expenseId: expense.id,
      description: 'edited test expense'
    })

    expect(editedExpense).toBeTruthy()
    expect(editedExpense).not.toEqual(expense)
    expect(editedExpense.description).toBe('edited test expense')
  })

  it('should be able to edit only cost field of an expense', async () => {
    const editedExpense = await editExpenseUseCase.execute({
      ownerId: userId,
      expenseId: expense.id,
      cost: 80
    })

    expect(editedExpense).toBeTruthy()
    expect(editedExpense).not.toEqual(expense)
    expect(editedExpense.cost).toBe(80)
  })

  it('should not be able to edit an expense with negative cost field', async () => {
    await expect(async () => {
      return await editExpenseUseCase.execute({
        ownerId: userId,
        expenseId: expense.id,
        cost: -80
      })
    }).rejects.toThrow()
  })

  it('should be able to edit only paid field of an expense', async () => {
    const editedExpense = await editExpenseUseCase.execute({
      ownerId: userId,
      expenseId: expense.id,
      paid: false
    })

    expect(editedExpense).toBeTruthy()
    expect(editedExpense).not.toEqual(expense)
    expect(editedExpense.paid).toBe(false)
  })

  it('should be able to edit only paidAt field of an expense', async () => {
    const editedExpense = await editExpenseUseCase.execute({
      ownerId: userId,
      expenseId: expense.id,
      paidAt: new Date(5000) // 5000 is a random value
    })

    expect(editedExpense).toBeTruthy()
    expect(editedExpense).not.toEqual(expense)
    expect(editedExpense.paidAt).toEqual(new Date(5000))
  })
})
