import { Pool } from 'pg'
import { createDatabaseConnection } from '@database/connectDatabase'
import { Expense } from '@entities/expense'
import {
  IExpenseRepository,
  editExpenseDTO
} from '@repositories/IExpensesRepository'

export const PostgresExpensesRepository = (): IExpenseRepository => {
  let client: Pool

  const connectDatabase = async () => {
    if (!client) client = await createDatabaseConnection()
  }

  const createExpense = async (
    ownerId: string,
    expense: Expense
  ): Promise<void> => {
    await connectDatabase()

    await client.query(
      `
        INSERT INTO EXPENSES 
          (ID, DESCRIPTION, COST, PAID, PAID_AT, OWNER_ID) 
        VALUES 
            ($1, $2, $3, $4, $5, $6)
      `,
      [
        expense.id,
        expense.description,
        expense.cost,
        expense.paid,
        expense.paidAt,
        ownerId
      ]
    )
  }

  const getExpenseById = async (
    ownerId: string,
    expenseId: string
  ): Promise<Expense | null> => {
    await connectDatabase()

    const { rows } = await client.query(
      `
        SELECT * 
        FROM 
          EXPENSES 
        WHERE 
          ID = $1 AND OWNER_ID = $2
      `,
      [expenseId, ownerId]
    )

    if (!rows.length) return null

    const { description, cost, paid, paid_at: paidAt } = rows[0]

    return new Expense(
      {
        description,
        cost,
        paid,
        paidAt
      },
      expenseId
    )
  }

  const getAllExpenses = async (ownerId: string): Promise<Expense[]> => {
    await connectDatabase()

    const { rows } = await client.query(
      `
      SELECT * 
      FROM 
        EXPENSES 
      WHERE 
        OWNER_ID = $1
      `,
      [ownerId]
    )

    if (!rows.length) return []

    const expenses = rows.map(expense => {
      return new Expense({
        description: expense.description,
        cost: expense.cost,
        paid: expense.paid,
        paidAt: expense.paid_at
      })
    })

    return expenses
  }

  const getPaidExpenses = async (ownerId: string): Promise<Expense[]> => {
    await connectDatabase()

    const { rows } = await client.query(
      `
      SELECT * 
      FROM 
        EXPENSES 
      WHERE 
        OWNER_ID = $1 AND PAID = TRUE
      `,
      [ownerId]
    )

    if (!rows.length) return []

    const paidExpenses = rows.map(expense => {
      return new Expense(
        {
          description: expense.description,
          cost: expense.cost,
          paid: expense.paid,
          paidAt: expense.paid_at
        },
        expense.id
      )
    })

    return paidExpenses
  }

  const getNoPaidExpenses = async (ownerId: string): Promise<Expense[]> => {
    await connectDatabase()

    const { rows } = await client.query(
      `
        SELECT * 
        FROM 
          EXPENSES 
        WHERE 
          OWNER_ID = $1 AND PAID = FALSE
      `,
      [ownerId]
    )

    if (!rows.length) return []

    const notPaidExpenses = rows.map(expense => {
      return new Expense(
        {
          description: expense.description,
          cost: expense.cost,
          paid: expense.paid,
          paidAt: expense.paid_at
        },
        expense.id
      )
    })

    return notPaidExpenses
  }

  const markExpenseAsPaid = async (
    ownerId: string,
    expenseId: string
  ): Promise<Expense | null> => {
    const expense = await getExpenseById(ownerId, expenseId)

    if (!expense) return null

    expense.paid = true

    await client.query(
      `
      UPDATE 
        EXPENSES 
      SET 
        PAID = $1,
        PAID_AT = $2 
      WHERE 
        ID = $3 AND OWNER_ID = $4
      `,
      [expense.paid, new Date(), expenseId, ownerId]
    )

    return expense
  }

  const editExpense = async ({
    ownerId,
    expenseId,
    description,
    cost,
    paid,
    paidAt
  }: editExpenseDTO): Promise<Expense | null> => {
    await connectDatabase()

    const expense = await getExpenseById(ownerId, expenseId)

    if (!expense) return null

    if (
      !(description && cost >= 0 && paidAt) ||
      paid === null ||
      paid === undefined
    )
      return expense

    expense.description = description ?? expense.description
    expense.cost = cost ?? expense.cost
    expense.paid = paid ?? expense.paid
    expense.paidAt = paidAt ?? expense.paidAt

    await client.query(
      `
        UPDATE 
          EXPENSES
        SET 
          DESCRIPTION = $2, 
          COST = $3, 
          PAID = $4, 
          PAID_AT = $5
        WHERE 
          ID = $1
      `,
      [
        expense.id,
        expense.description,
        expense.cost,
        expense.paid,
        expense.paidAt
      ]
    )

    return expense
  }

  const deleteExpense = async (
    ownerId: string,
    expenseId: string
  ): Promise<void> => {
    await connectDatabase()

    await client.query(
      `
        DELETE 
          FROM EXPENSES 
        WHERE 
          ID = $1 AND OWNER_ID = $2
      `,
      [expenseId, ownerId]
    )
  }

  return Object.freeze({
    createExpense,
    getExpenseById,
    getAllExpenses,
    getPaidExpenses,
    getNoPaidExpenses,
    markExpenseAsPaid,
    editExpense,
    deleteExpense
  })
}
