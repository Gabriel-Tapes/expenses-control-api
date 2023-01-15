import { Expense } from '@entities/expense'
import { Request, Response } from 'express'
import { IEditExpenseDTO } from '../editExpense/IEditExpenseDTO'
import { GetExpenseController } from './getExpenseController'
import { IGetExpenseUseCase } from './getExpenseUseCase'

describe('Get Expense controller tests', () => {
  let getExpenseUseCase: IGetExpenseUseCase
  let getExpenseController: ReturnType<typeof GetExpenseController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const expense = new Expense({
    description: 'test expense',
    cost: 50,
    paid: false
  })

  beforeEach(() => {
    getExpenseUseCase = {
      execute: jest.fn(({ ownerId, expenseId }: IEditExpenseDTO) => {
        if (ownerId === userId && expenseId === expense.id)
          return Promise.resolve(expense)

        return Promise.resolve(null)
      })
    }

    req = {
      headers: {
        userId
      },
      query: {
        id: expense.id
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    getExpenseController = GetExpenseController(getExpenseUseCase)
  })

  it('should return 200 and expense object', async () => {
    await getExpenseController.handle(req, res)

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

  it('should return 404 and error message "expense not found" if a non-matching expense id is provided', async () => {
    req.query.id = 'non-matching expense id'

    await getExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'expense not found' })
  })

  it('should return 404 and error message "expense not found" if a non-matching user id is provided', async () => {
    req.headers.userId = 'non-matching user id'

    await getExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'expense not found' })
  })

  it('should return 400 and error message if thrown an error getting the expense', async () => {
    getExpenseUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error getting expense'))

    await getExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'error getting expense' })
  })
})
