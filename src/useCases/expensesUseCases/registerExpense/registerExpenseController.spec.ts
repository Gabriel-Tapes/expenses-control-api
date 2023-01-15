import { Expense } from '@entities/expense'
import { Request, Response } from 'express'
import { RegisterExpenseController } from './registerExpenseController'
import { IRegisterExpenseUseCase } from './registerExpenseUseCase'

describe('Register Expense controller tests', () => {
  let registerExpenseUseCase: IRegisterExpenseUseCase
  let registerExpenseController: ReturnType<typeof RegisterExpenseController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const expense = new Expense({
    description: 'test expense',
    cost: 50,
    paid: false
  })

  beforeEach(() => {
    registerExpenseUseCase = {
      execute: jest.fn(() => {
        return Promise.resolve(expense)
      })
    }

    req = {
      headers: {
        userId
      },
      body: {
        description: expense.description,
        cost: expense.cost,
        paid: expense.paid
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    registerExpenseController = RegisterExpenseController(
      registerExpenseUseCase
    )
  })

  it('should return status 200 and expense object', async () => {
    await registerExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expense: {
        id: expense.id,
        description: expense.description,
        cost: expense.cost,
        paid: expense.paid,
        paidAt: expense.paidAt,
        ownerId: userId
      }
    })
  })

  it('should return status 400 and error message if thrown an error while register the expense', async () => {
    registerExpenseUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error creating expense'))

    await registerExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'error creating expense' })
  })
})
