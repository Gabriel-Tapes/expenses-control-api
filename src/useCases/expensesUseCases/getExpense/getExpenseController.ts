import { Request, Response } from 'express'
import { IGetExpenseUseCase } from './getExpenseUseCase'

export const GetExpenseController = (getExpenseUseCase: IGetExpenseUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const ownerId = req.headers.userId as string
    const expenseId = req.query.id.toString()

    try {
      const expense = await getExpenseUseCase.execute({ ownerId, expenseId })

      if (!expense) return res.status(404).json({ error: 'expense not found' })

      return res.status(200).json({
        expense: {
          id: expense.id,
          description: expense.description,
          cost: expense.cost,
          paid: expense.paid,
          paidAt: expense.paidAt,
          ownerId
        }
      })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
