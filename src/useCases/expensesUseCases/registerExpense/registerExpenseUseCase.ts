import { Expense } from '@entities/expense'
import { IExpenseRepository } from '@repositories/IExpensesRepository'
import { IRegisterExpenseDTO } from './IRegisterExpenseDTO'

export interface IRegisterExpenseUseCase {
  execute({ description, cost, paid }: IRegisterExpenseDTO): Promise<Expense>
}

export const RegisterExpenseUseCase = (
  expensesRepository: IExpenseRepository
): IRegisterExpenseUseCase => {
  const execute = async ({
    ownerId,
    description,
    cost,
    paid
  }: IRegisterExpenseDTO): Promise<Expense> => {
    const expense = new Expense({
      description,
      cost,
      paid
    })

    await expensesRepository.createExpense(ownerId, expense)

    return expense
  }

  return Object.freeze({ execute })
}
