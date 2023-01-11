import { InMemoryExpensesRepository } from './inMemoryExpensesRepository'
import { Expense } from '@entities/expense'

describe('In Memory Expenses repository its', () => {
  it('should create an expense', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense)
    const createdExpense = await expensesRepository.getExpenseById(
      'owner id',
      expense.id
    )
    expect(createdExpense).toEqual(expense)
  })

  it('should return expense with matching id and ownerId', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense)
    const result = await expensesRepository.getExpenseById(
      'owner id',
      expense.id
    )
    expect(result).toEqual(expense)
  })

  it('should return null for expense with non-matching id', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('1', expense)
    const result = await expensesRepository.getExpenseById(
      'owner id',
      'non-matching-id'
    )
    expect(result).toBeNull()
  })

  it('should return all expenses for the owner', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense1 = new Expense({
      description: 'test expense 1',
      cost: 100,
      paid: false
    })

    const expense2 = new Expense({
      description: 'test expense 2',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense1)
    await expensesRepository.createExpense('owner id', expense2)

    const result = await expensesRepository.getAllExpenses('owner id')
    expect(result).toEqual([expense1, expense2])
  })

  it('should return all paid expenses for the owner', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense1 = new Expense({
      description: 'test expense 1',
      cost: 100,
      paid: false
    })

    const expense2 = new Expense({
      description: 'test expense 2',
      cost: 100,
      paid: false
    })

    expense2.paid = true

    await expensesRepository.createExpense('owner id', expense1)
    await expensesRepository.createExpense('owner id', expense2)

    const result = await expensesRepository.getPaidExpenses('owner id')
    expect(result).toEqual([expense2])
  })

  it('should return all unpaid expenses for the owner', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense1 = new Expense({
      description: 'test expense 1',
      cost: 100,
      paid: false
    })

    const expense2 = new Expense({
      description: 'test expense 1',
      cost: 100,
      paid: false
    })
    expense2.paid = true

    await expensesRepository.createExpense('owner id', expense1)
    await expensesRepository.createExpense('owner id', expense2)

    const result = await expensesRepository.getNoPaidExpenses('owner id')
    expect(result).toEqual([expense1])
  })

  it('should mark an expense as paid', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense)

    const markedExpense = await expensesRepository.markExpenseAsPaid(
      'owner id',
      expense.id
    )
    expect(markedExpense!.paid).toBe(true)
  })

  it('should not mark as paid and return null for expense with non-matching id', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense)
    const markedExpense = await expensesRepository.markExpenseAsPaid(
      'owner id',
      'non-matching-id'
    )
    expect(markedExpense).toBeNull()
  })

  it('should edit an expense', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense)

    const editedExpense = await expensesRepository.editExpense({
      ownerId: 'owner id',
      expenseId: expense.id,
      description: 'Edited Test Expense',
      cost: 300,
      paid: true
    })
    expect(editedExpense!.description).toBe('Edited Test Expense')
    expect(editedExpense!.cost).toBe(300)
  })

  it('should return null for expense with non-matching id', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense)

    const editedExpense = await expensesRepository.editExpense({
      ownerId: 'owner id',
      expenseId: 'non-matching-id',
      description: 'Edited Test Expense',
      cost: 300
    })
    expect(editedExpense).toBeNull()
  })

  it('should delete an expense', async () => {
    const expensesRepository = InMemoryExpensesRepository()

    const expense = new Expense({
      description: 'test expense',
      cost: 100,
      paid: false
    })

    await expensesRepository.createExpense('owner id', expense)

    await expensesRepository.deleteExpense('owner id', expense.id)

    const result = await expensesRepository.getExpenseById(
      'owner id',
      expense.id
    )
    expect(result).toBeNull()
  })
})
