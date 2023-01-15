import { Request, Response } from 'express'
import { IGetExpensesUseCase } from './getExpensesUseCase'

export const GetExpensesController = (
  getExpensesUseCase: IGetExpensesUseCase
) => {
  const handle = async (req: Request, res: Response) => {
    const userId = req.headers.userId as string
    const strategy = req.query.strategy?.toString()

    try {
      const expenses = await getExpensesUseCase.execute({
        strategy,
        ownerId: userId
      })

      const parsedExpenses = expenses.map(expense => {
        return {
          id: expense.id,
          description: expense.description,
          cost: expense.cost,
          paid: expense.paid,
          paidAt: expense.paidAt,
          ownerId: userId
        }
      })

      return res.status(200).json({ expenses: parsedExpenses })
    } catch (err) {
      if (err) return res.status(500).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
