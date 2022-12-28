import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { IGetExpensesDTO } from './IGetExpensesDTO'
import { Expense } from '@entities/expense'

export interface IGetExpensesUseCase {
  execute({ strategy, ownerId }: IGetExpensesDTO): Promise<Expense[]>
}

export const GetExpensesUseCase = (expensesRepository: IExpenseRepository) => {
  const execute = async ({
    strategy,
    ownerId
  }: IGetExpensesDTO): Promise<Expense[]> => {
    if (strategy === 'paid')
      return await expensesRepository.getPaidExpenses(ownerId)
    else if (strategy === 'no paid')
      return await expensesRepository.getNoPaidExpenses(ownerId)

    return await expensesRepository.getAllExpenses(ownerId)
  }

  return Object.freeze({ execute })
}
