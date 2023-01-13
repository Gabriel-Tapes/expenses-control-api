import { Expense } from '@entities/expense'
import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { InMemoryExpensesRepository } from '@repositories/inMemory/inMemoryExpensesRepository'
import { GetExpensesUseCase, IGetExpensesUseCase } from './getExpensesUseCase'

describe('Get Expenses use case tests', () => {
  let expensesRepository: IExpenseRepository
  let getExpensesUseCase: IGetExpensesUseCase

  const userId = 'userId'

  const expense1 = new Expense({
    description: 'test expense 1',
    cost: 50,
    paid: false
  })

  const expense2 = new Expense({
    description: 'test expense 2',
    cost: 50,
    paid: true
  })
  const expense3 = new Expense({
    description: 'test expense 2',
    cost: 50,
    paid: true
  })

  beforeAll(async () => {
    expensesRepository = InMemoryExpensesRepository()

    expensesRepository.createExpense(userId, expense1)
    expensesRepository.createExpense(userId, expense2)
    expensesRepository.createExpense(userId, expense3)

    getExpensesUseCase = GetExpensesUseCase(expensesRepository)
  })

  it('should be able to get all user expenses with a matching user id', async () => {
    const expenses = await getExpensesUseCase.execute({ ownerId: userId })

    expect(expenses).toBeTruthy()
    expect(expenses.length).toBe(3)
    expect(expenses).toEqual([expense1, expense2, expense3])
  })

  it('should be able to get all paid expenses with strategy "paid"', async () => {
    const expenses = await getExpensesUseCase.execute({
      ownerId: userId,
      strategy: 'paid'
    })

    expect(expenses).toBeTruthy()
    expect(expenses.length).toBe(2)
    expect(expenses).toEqual([expense2, expense3])
  })

  it('should be able to get all no paid expenses with strategy "no paid"', async () => {
    const expenses = await getExpensesUseCase.execute({
      ownerId: userId,
      strategy: 'no paid'
    })

    expect(expenses).toBeTruthy()
    expect(expenses.length).toBe(1)
    expect(expenses).toEqual([expense1])
  })

  it('should return all user expenses if strategy field be different than "paid" and "no paid"', async () => {
    const expenses = await getExpensesUseCase.execute({
      ownerId: userId,
      strategy: 'different than paid and no paid'
    })

    expect(expenses).toBeTruthy()
    expect(expenses.length).toBe(3)
    expect(expenses).toEqual([expense1, expense2, expense3])
  })

  it('should return an empty list if a non-matching user id is provided', async () => {
    const expenses = await getExpensesUseCase.execute({
      ownerId: 'non-matching user id'
    })

    expect(expenses).toBeTruthy()
    expect(expenses.length).toBe(0)
  })
})
