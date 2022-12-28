import { Request, Response } from 'express'
import { IRegisterExpenseUseCase } from './registerExpenseUseCase'

export const RegisterExpenseController = (
  registerExpenseUseCase: IRegisterExpenseUseCase
) => {
  const handle = async (req: Request, res: Response) => {
    const ownerId = req.headers.userId as string
    const { description, cost, paid } = req.body

    try {
      const expense = await registerExpenseUseCase.execute({
        ownerId,
        description,
        cost,
        paid
      })

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
      if (err) return res.status(400).json({ error: err.message })
    }
  }

  return Object.freeze({ handle })
}
