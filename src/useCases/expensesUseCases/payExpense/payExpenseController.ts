import { Request, Response } from 'express'
import { IPayExpenseUseCase } from './payExpenseUseCase'

export const PayExpenseController = (payExpenseUseCase: IPayExpenseUseCase) => {
  const handle = async (req: Request, res: Response) => {
    const ownerId = req.headers.userId as string
    const { id: expenseId } = req.body

    try {
      const expense = await payExpenseUseCase.execute({ ownerId, expenseId })

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
      if (err) return res.status(500).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
