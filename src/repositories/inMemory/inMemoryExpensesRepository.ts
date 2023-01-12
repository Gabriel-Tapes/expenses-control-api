import { Expense } from '@entities/expense'
import {
  IExpenseRepository,
  editExpenseDTO
} from '@repositories/IExpensesRepository'

interface ExpenseData {
  expense: Expense
  ownerId: string
}

export const InMemoryExpensesRepository = (): IExpenseRepository => {
  let expenses: ExpenseData[] = []

  const createExpense = async (
    ownerId: string,
    expense: Expense
  ): Promise<void> => {
    expenses.push({
      expense,
      ownerId
    })
  }

  const getExpenseById = async (
    ownerId: string,
    expenseId: string
  ): Promise<Expense | null> => {
    const expenseData = expenses.find(
      expenseData =>
        expenseData.expense.id === expenseId && expenseData.ownerId === ownerId
    )

    if (!expenseData) return null

    return expenseData.expense
  }

  const getAllExpenses = async (ownerId: string): Promise<Expense[]> => {
    return expenses
      .filter(expenseData => expenseData.ownerId === ownerId)
      .map(expenseData => expenseData.expense)
  }

  const getPaidExpenses = async (ownerId: string): Promise<Expense[]> => {
    return expenses
      .filter(
        expenseData =>
          expenseData.ownerId === ownerId && expenseData.expense.paid
      )
      .map(expenseData => expenseData.expense)
  }

  const getNoPaidExpenses = async (ownerId: string): Promise<Expense[]> => {
    return expenses
      .filter(
        expenseData =>
          expenseData.ownerId === ownerId && !expenseData.expense.paid
      )
      .map(expenseData => expenseData.expense)
  }

  const markExpenseAsPaid = async (
    ownerId: string,
    expenseId: string
  ): Promise<Expense | null> => {
    const expense = await getExpenseById(ownerId, expenseId)

    if (!expense) return null

    expense.paid = true

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
    const expense = await getExpenseById(ownerId, expenseId)

    if (!expense) return null

    expense.description = description ?? expense.description
    expense.cost = cost ?? expense.cost
    expense.paid = paid ?? expense.paid
    if (expense.paid) expense.paidAt = paidAt ?? expense.paidAt

    return expense
  }

  const deleteExpense = async (
    ownerId: string,
    expenseId: string
  ): Promise<void> => {
    expenses = expenses.filter(
      expenseData =>
        !(
          expenseData.ownerId === ownerId &&
          expenseData.expense.id === expenseId
        )
    )
  }

  return Object.freeze({
    createExpense,
    getExpenseById,
    getAllExpenses,
    getNoPaidExpenses,
    markExpenseAsPaid,
    getPaidExpenses,
    editExpense,
    deleteExpense
  })
}
