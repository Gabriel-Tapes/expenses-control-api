import { Expense } from '@entities/expense'
import { IPayExpenseDTO } from './payExpenseDTO'
import { IExpenseRepository } from '@repositories/IExpensesRepository'

export interface IPayExpenseUseCase {
  execute({ ownerId, expenseId }: IPayExpenseDTO): Promise<Expense | null>
}

export const PayExpenseUseCase = (
  expensesRepository: IExpenseRepository
): IPayExpenseUseCase => {
  const execute = async ({
    ownerId,
    expenseId
  }: IPayExpenseDTO): Promise<Expense | null> => {
    return await expensesRepository.markExpenseAsPaid(ownerId, expenseId)
  }

  return Object.freeze({ execute })
}
