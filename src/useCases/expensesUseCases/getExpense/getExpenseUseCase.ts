import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { IGetExpenseDTO } from './IGetExpenseDTO'
import { Expense } from '@entities/expense'

export interface IGetExpenseUseCase {
  execute({ ownerId, expenseId }: IGetExpenseDTO): Promise<Expense | null>
}

export const GetExpenseUseCase = (
  expensesRepository: IExpenseRepository
): IGetExpenseUseCase => {
  const execute = async ({
    ownerId,
    expenseId
  }: IGetExpenseDTO): Promise<Expense | null> => {
    return await expensesRepository.getExpenseById(expenseId, ownerId)
  }

  return Object.freeze({ execute })
}
