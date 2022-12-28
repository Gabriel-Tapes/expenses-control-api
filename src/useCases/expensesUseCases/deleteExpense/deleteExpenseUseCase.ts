import { IExpenseRepository } from '@repositories/IExpensesRepository'

export interface IDeleteExpenseUseCase {
  execute(ownerId: string, expenseId: string): Promise<void>
}

export const DeleteExpenseUseCase = (
  expensesRepository: IExpenseRepository
): IDeleteExpenseUseCase => {
  const execute = async (ownerId: string, expenseId: string): Promise<void> => {
    if (!(await expensesRepository.getExpenseById(ownerId, expenseId)))
      throw new Error('expense not found')

    await expensesRepository.deleteExpense(ownerId, expenseId)
  }

  return Object.freeze({ execute })
}
