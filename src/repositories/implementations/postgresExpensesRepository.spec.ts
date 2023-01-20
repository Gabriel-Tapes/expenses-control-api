import { runMigrations } from '@database/runMigrations'
import { Expense } from '@entities/expense'
import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { newDb } from 'pg-mem'
import { v4 } from 'uuid'
import { PostgresExpensesRepository } from './postgresExpensesRepository'

const userId = v4()

jest.mock('@database/connectDatabase', () => ({
  createDatabaseConnection: jest.fn(async () => {
    const { Pool } = newDb().adapters.createPg()

    const connection = new Pool()

    await runMigrations(connection)

    await connection.query(
      `
      INSERT INTO USERS (ID, NAME, LAST_NAME, EMAIL, PASSWORD)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [userId, 'Joe', 'Doe', 'joe.doe@exemple.com', 'password']
    )

    return connection
  })
}))

describe('Postgres Expenses repository tests', () => {
  let expensesRepository: IExpenseRepository

  const expense = new Expense({
    description: 'Test Expense',
    cost: 30,
    paid: false
  })

  beforeEach(() => {
    expensesRepository = PostgresExpensesRepository()
  })

  describe('Create expense', () => {
    it('should be able to create an expense', async () => {
      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        userId,
        expense.id
      )

      expect(gottenExpense).toBeTruthy()
      expect(gottenExpense).toEqual(expense)
    })

    it('should not be able to create an expense with a non-matching user id', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(nonMatchingUserId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        nonMatchingUserId,
        expense.id
      )

      expect(gottenExpense).toBeNull()
    })

    it('should not be able to create an expense with an invalid user id', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(invalidUserId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        invalidUserId,
        expense.id
      )

      expect(gottenExpense).toBeNull()
    })
  })

  describe('Get expense by id', () => {
    it('should be able to get an expense by id', async () => {
      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        userId,
        expense.id
      )

      expect(gottenExpense).toBeTruthy()
      expect(gottenExpense).toEqual(expense)
    })

    it('should not be able to get an expense by id with a non-matching user id', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        nonMatchingUserId,
        expense.id
      )

      expect(gottenExpense).toBeNull()
    })

    it('should not be able to get an expense by id with a non-matching expense id', async () => {
      const nonMatchingExpenseId = v4()

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        userId,
        nonMatchingExpenseId
      )

      expect(gottenExpense).toBeNull()
    })

    it('should not be able to get an expense by id with a invalid user id', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        invalidUserId,
        expense.id
      )

      expect(gottenExpense).toBeNull()
    })

    it('should not be able to get an expense by id with a invalid expense id', async () => {
      const invalidExpenseId = 'invalid expense id'

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.getExpenseById(
        userId,
        invalidExpenseId
      )

      expect(gottenExpense).toBeNull()
    })
  })

  describe('Get all expenses by user id', () => {
    it('should be able to get all expenses by user id', async () => {
      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getAllExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(1)
    })

    it('should return an empty list if a non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getAllExpenses(
        nonMatchingUserId
      )

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(0)
    })

    it('should return an empty list if a invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getAllExpenses(invalidUserId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(0)
    })
  })

  describe('Get paid expenses by user id', () => {
    const paidExpense = new Expense({
      description: 'Test Expense',
      cost: 30,
      paid: true
    })

    it('should be able to get paid expenses by user id', async () => {
      await expensesRepository.createExpense(userId, paidExpense)

      const allExpenses = await expensesRepository.getPaidExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(1)
    })

    it('should return an empty list if a non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getPaidExpenses(
        nonMatchingUserId
      )

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(0)
    })

    it('should return an empty list if a invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getPaidExpenses(
        invalidUserId
      )

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(0)
    })
  })

  describe('Get no paid expenses by user id', () => {
    it('should be able to get no paid expenses by user id', async () => {
      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getNoPaidExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(1)
    })

    it('should return an empty list if a non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getNoPaidExpenses(
        nonMatchingUserId
      )

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(0)
    })

    it('should return an empty list if a invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(userId, expense)

      const allExpenses = await expensesRepository.getNoPaidExpenses(
        invalidUserId
      )

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(0)
    })
  })

  describe('Mark expense as paid', () => {
    it('should be able to mark an expense as paid', async () => {
      await expensesRepository.createExpense(userId, expense)

      await expensesRepository.markExpenseAsPaid(userId, expense.id)

      const gottenExpense = await expensesRepository.getExpenseById(
        userId,
        expense.id
      )

      expect(gottenExpense).toBeTruthy()
      expect(gottenExpense.id).toEqual(expense.id)
      expect(gottenExpense.paid).toEqual(true)
    })

    it('should return null if a non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.markExpenseAsPaid(
        nonMatchingUserId,
        expense.id
      )

      expect(gottenExpense).toBeNull()
    })

    it('should return null if a non-matching expense id is provided', async () => {
      const nonMatchingExpenseId = v4()

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.markExpenseAsPaid(
        userId,
        nonMatchingExpenseId
      )

      expect(gottenExpense).toBeNull()
    })

    it('should return null if a invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.markExpenseAsPaid(
        invalidUserId,
        expense.id
      )

      expect(gottenExpense).toBeNull()
    })

    it('should return null if an invalid expense id is provided', async () => {
      const invalidExpenseId = 'invalid expense id'

      await expensesRepository.createExpense(userId, expense)

      const gottenExpense = await expensesRepository.markExpenseAsPaid(
        userId,
        invalidExpenseId
      )

      expect(gottenExpense).toBeNull()
    })
  })

  describe('Edit expense', () => {
    const editedExpense = new Expense(
      {
        description: 'edited Test Expense',
        cost: expense.cost + 10,
        paid: true,
        paidAt: new Date(5000)
      },
      expense.id
    )

    it('should be able to edit an expense', async () => {
      await expensesRepository.createExpense(userId, expense)

      await expensesRepository.editExpense({
        ownerId: userId,
        expenseId: expense.id,
        description: editedExpense.description,
        cost: editedExpense.cost,
        paid: editedExpense.paid,
        paidAt: editedExpense.paidAt
      })

      const gottenExpense = await expensesRepository.getExpenseById(
        userId,
        expense.id
      )

      expect(gottenExpense).toBeTruthy()
      expect(gottenExpense).not.toEqual(expense)
      expect(gottenExpense.description).toEqual(editedExpense.description)
      expect(gottenExpense.cost).toEqual(editedExpense.cost)
      expect(gottenExpense.paid).toEqual(editedExpense.paid)
    })

    it('should return the same expense if no changes are made', async () => {
      await expensesRepository.createExpense(userId, expense)

      const returnedExpense = await expensesRepository.editExpense({
        ownerId: userId,
        expenseId: expense.id
      })

      expect(returnedExpense).toBeTruthy()
      expect(returnedExpense).toEqual(expense)
    })

    it('should return null if an non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(userId, expense)

      const returnedExpense = await expensesRepository.editExpense({
        ownerId: nonMatchingUserId,
        expenseId: expense.id,
        description: editedExpense.description,
        cost: editedExpense.cost,
        paid: editedExpense.paid,
        paidAt: editedExpense.paidAt
      })

      expect(returnedExpense).toBeNull()
    })

    it('should return null if an non-matching expense id is provided', async () => {
      const nonMatchingExpenseId = v4()

      await expensesRepository.createExpense(userId, expense)

      const returnedExpense = await expensesRepository.editExpense({
        ownerId: userId,
        expenseId: nonMatchingExpenseId,
        description: editedExpense.description,
        cost: editedExpense.cost,
        paid: editedExpense.paid,
        paidAt: editedExpense.paidAt
      })

      expect(returnedExpense).toBeNull()
    })

    it('should return null if an invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(userId, expense)

      const returnedExpense = await expensesRepository.editExpense({
        ownerId: invalidUserId,
        expenseId: expense.id,
        description: editedExpense.description,
        cost: editedExpense.cost,
        paid: editedExpense.paid,
        paidAt: editedExpense.paidAt
      })

      expect(returnedExpense).toBeNull()
    })

    it('should return null if an invalid expense id is provided', async () => {
      const invalidExpenseId = v4()

      await expensesRepository.createExpense(userId, expense)

      const returnedExpense = await expensesRepository.editExpense({
        ownerId: userId,
        expenseId: invalidExpenseId,
        description: editedExpense.description,
        cost: editedExpense.cost,
        paid: editedExpense.paid,
        paidAt: editedExpense.paidAt
      })

      expect(returnedExpense).toBeNull()
    })
  })

  describe('Delete expense', () => {
    it('should be able to delete an expense', async () => {
      await expensesRepository.createExpense(userId, expense)

      await expensesRepository.deleteExpense(userId, expense.id)

      const allExpenses = await expensesRepository.getAllExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(0)
    })

    it('should not delete the expense if an non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      await expensesRepository.createExpense(userId, expense)

      await expensesRepository.deleteExpense(nonMatchingUserId, expense.id)

      const allExpenses = await expensesRepository.getAllExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(1)
    })

    it('should not delete the expense if an non-matching expense id is provided', async () => {
      const nonMatchingExpenseId = v4()

      await expensesRepository.createExpense(userId, expense)

      await expensesRepository.deleteExpense(userId, nonMatchingExpenseId)

      const allExpenses = await expensesRepository.getAllExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(1)
    })

    it('should not delete the expense if an invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      await expensesRepository.createExpense(userId, expense)

      await expensesRepository.deleteExpense(invalidUserId, expense.id)

      const allExpenses = await expensesRepository.getAllExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(1)
    })

    it('should not delete the expense if an invalid expense id is provided', async () => {
      const invalidExpenseId = v4()

      await expensesRepository.createExpense(userId, expense)

      await expensesRepository.deleteExpense(userId, invalidExpenseId)

      const allExpenses = await expensesRepository.getAllExpenses(userId)

      expect(allExpenses).toBeTruthy()
      expect(allExpenses).toHaveLength(1)
    })
  })
})
