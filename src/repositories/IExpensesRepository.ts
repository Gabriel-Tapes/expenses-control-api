import { Expense } from '../entities/expense'

export interface editExpenseDTO {
  ownerId: string
  expenseId: string
  description?: string
  cost?: number
  paid?: boolean
  paidAt?: Date
}

export interface IExpenseRepository {
  createExpense(ownerId: string, expense: Expense): Promise<void>
  getExpenseById(ownerId: string, expenseId: string): Promise<Expense | null>
  getAllExpenses(ownerId: string): Promise<Expense[]>
  getNoPaidExpenses(ownerId: string): Promise<Expense[]>
  markExpenseAsPaid(ownerId: string, expenseId: string): Promise<Expense | null>
  getPaidExpenses(ownerId: string): Promise<Expense[]>
  editExpense({
    ownerId,
    expenseId,
    description,
    cost,
    paid,
    paidAt
  }: editExpenseDTO): Promise<Expense | null>
  deleteExpense(ownerId: string, expenseId: string): Promise<void>
}
