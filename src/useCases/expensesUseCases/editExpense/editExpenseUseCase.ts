import { Expense } from '@entities/expense'
import { IEditExpenseDTO } from './IEditExpenseDTO'
import { IExpenseRepository } from '@repositories/IExpensesRepository'

export interface IEditExpenseUseCase {
  execute({
    ownerId,
    expenseId,
    description,
    cost,
    paid,
    paidAt
  }: IEditExpenseDTO): Promise<Expense | null>
}

export const EditExpenseUseCase = (
  expensesRepository: IExpenseRepository
): IEditExpenseUseCase => {
  const execute = async ({
    ownerId,
    expenseId,
    description,
    cost,
    paid,
    paidAt
  }: IEditExpenseDTO): Promise<Expense | null> => {
    return await expensesRepository.editExpense({
      ownerId,
      expenseId,
      description,
      cost,
      paid,
      paidAt
    })
  }

  return Object.freeze({ execute })
}
