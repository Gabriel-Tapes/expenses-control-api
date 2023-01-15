import { Request, Response } from 'express'
import { DeleteExpenseController } from './deleteExpenseController'
import { IDeleteExpenseUseCase } from './deleteExpenseUseCase'

describe('Delete Expense controller tests', () => {
  let deleteExpenseUseCase: IDeleteExpenseUseCase
  let deleteExpenseController: ReturnType<typeof DeleteExpenseController>

  let req: Request
  let res: Response

  const userId = 'userId'
  const expenseId = 'expenseId'

  beforeEach(() => {
    deleteExpenseUseCase = {
      execute: jest.fn()
    }

    req = {
      headers: {
        userId
      },
      body: {
        id: expenseId
      }
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    deleteExpenseController = DeleteExpenseController(deleteExpenseUseCase)
  })

  it('should return status 200 and message if expense is deleted successfully', async () => {
    await deleteExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'expense deleted successfully'
    })
  })

  it('should return status 404 and message if err.message is "expense not found"', async () => {
    deleteExpenseUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('expense not found'))

    await deleteExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'expense not found'
    })
  })

  it('should return status 500 and message if an error is thrown while delete the expense', async () => {
    deleteExpenseUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error deleting expense'))

    await deleteExpenseController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'error deleting expense'
    })
  })
})
