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
    if (cost && cost < 0)
      throw new Error('edit expense error: invalid cost less than 0')

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
