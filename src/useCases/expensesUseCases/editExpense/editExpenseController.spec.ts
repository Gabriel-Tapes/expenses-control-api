import { Expense } from '@entities/expense'
import { Request, Response } from 'express'
import { EditExpenseController } from './editExpenseController'
import { IEditExpenseUseCase } from './editExpenseUseCase'
import { IEditExpenseDTO } from './IEditExpenseDTO'

describe('Edit Expense controller tests', () => {
  let editExpenseUseCase: IEditExpenseUseCase
  let editExpenseController: ReturnType<typeof EditExpenseController>

  let req: Request
  let res: Response

  const userId = 'userId'

  const expense = new Expense({
    description: 'test expense',
    cost: 50,
    paid: true
  })
  const editedExpense = new Expense(
    {
      description: 'edited test expense',
      cost: 80,
      paid: true,
      paidAt: new Date(5000)
    },
    expense.id
  )

  beforeEach(() => {
    editExpenseUseCase = {
      execute: jest.fn(({ ownerId, expenseId }: IEditExpenseDTO) => {
        if (ownerId === userId && expenseId === expense.id)
          return Promise.resolve(editedExpense)
        else return Promise.resolve(null)
      })
    }

    req = {
      headers: {
        userId
      },

      body: {
        id: expense.id,
        description: editedExpense.description,
        cost: 80,
        paid: true,
        paidAt: editedExpense.paidAt
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    editExpenseController = EditExpenseController(editExpenseUseCase)
  })

  it('should return status 200 and edited expense', async () => {
    await editExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expense: {
        id: editedExpense.id,
        description: editedExpense.description,
        cost: 80,
        paid: true,
        paidAt: editedExpense.paidAt,
        ownerId: userId
      }
    })
  })

  it('should return status 400 if cost is less than 0', async () => {
    req.body.cost = -80

    await editExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'invalid cost value' })
  })

  it('should return status 404 if non-matching user id is provided', async () => {
    req.headers.userId = 'non-matching user id'

    await editExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'expense not found' })
  })

  it('should return status 404 if non-matching expense id is provided', async () => {
    req.body.id = 'non-matching expense id'

    await editExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'expense not found' })
  })

  it('should return 500 and error message id an error is thrown editing the expense', async () => {
    editExpenseUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error editing expense'))

    await editExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'error editing expense' })
  })
})
