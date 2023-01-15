import { Expense } from '@entities/expense'
import { Request, Response } from 'express'
import { PayExpenseController } from './payExpenseController'
import { IPayExpenseDTO } from './payExpenseDTO'
import { IPayExpenseUseCase } from './payExpenseUseCase'

describe('Pay Expense controller tests', () => {
  let payExpenseUseCase: IPayExpenseUseCase
  let payExpenseController: ReturnType<typeof PayExpenseController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const paidExpense = new Expense({
    description: 'paid test expense',
    cost: 50,
    paid: true
  })

  beforeEach(() => {
    payExpenseUseCase = {
      execute: jest.fn(({ ownerId, expenseId }: IPayExpenseDTO) => {
        if (ownerId !== userId || expenseId !== paidExpense.id)
          return Promise.resolve(null)
        return Promise.resolve(paidExpense)
      })
    }

    req = {
      headers: {
        userId
      },
      body: {
        id: paidExpense.id
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    payExpenseController = PayExpenseController(payExpenseUseCase)
  })

  it('should return status 200 and expense object if matching user and expense ids are provided', async () => {
    await payExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expense: {
        id: paidExpense.id,
        description: paidExpense.description,
        cost: paidExpense.cost,
        paid: paidExpense.paid,
        paidAt: paidExpense.paidAt,
        ownerId: userId
      }
    })
  })

  it('should return status 404 and an error message if a non-matching user id is provided', async () => {
    req.headers.userId = 'non-matching user id'

    await payExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'expense not found' })
  })

  it('should return status 404 and an error message if a non-matching expense id is provided', async () => {
    req.body.id = 'non-matching expense id'

    await payExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'expense not found' })
  })

  it('should return status 500 and an error message thrown an error paying the expense', async () => {
    payExpenseUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error paying the expense'))

    await payExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'error paying the expense' })
  })
})
