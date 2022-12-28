import { Request, Response } from 'express'
import { IEditExpenseUseCase } from './editExpenseUseCase'

export const EditExpenseController = (
  editExpenseUseCase: IEditExpenseUseCase
) => {
  const handle = async (req: Request, res: Response) => {
    const ownerId = req.headers.userId as string
    const { id: expenseId, description, cost, paid, paidAt } = req.body

    if (cost <= 0) return res.status(400).json({ error: 'invalid cost value' })

    try {
      const editedExpense = await editExpenseUseCase.execute({
        ownerId,
        expenseId,
        description,
        cost,
        paid,
        paidAt
      })

      if (!editedExpense)
        return res.status(404).json({ error: 'expense not found' })

      return res.status(200).json({
        expense: {
          id: editedExpense.id,
          description: editedExpense.description,
          cost: editedExpense.cost,
          paid: editedExpense.paid,
          paidAt: editedExpense.paidAt,
          ownerId
        }
      })
    } catch (err) {
      if (err) return res.status(500).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
