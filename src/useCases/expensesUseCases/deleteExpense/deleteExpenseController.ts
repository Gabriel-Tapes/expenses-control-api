import { Request, Response } from 'express'
import { IDeleteExpenseUseCase } from './deleteExpenseUseCase'

export const DeleteExpenseController = (
  deleteExpenseUseCase: IDeleteExpenseUseCase
) => {
  const handle = async (req: Request, res: Response) => {
    const ownerId = req.headers.userId as string
    const { id: expenseId } = req.body

    try {
      await deleteExpenseUseCase.execute(ownerId, expenseId)

      return res.status(200).json({ message: 'expense deleted successfully' })
    } catch (err) {
      let errorStatusCode = 500
      if (err.message === 'expense not found') errorStatusCode = 404
      return res.status(errorStatusCode).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
