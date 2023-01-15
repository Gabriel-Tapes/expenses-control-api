import { Expense } from '@entities/expense'
import { Request, Response } from 'express'
import { GetExpensesController } from './getExpensesController'
import { IGetExpensesUseCase } from './getExpensesUseCase'
import { IGetExpensesDTO } from './IGetExpensesDTO'

describe('Get Expenses controller tests', () => {
  let getExpensesUseCase: IGetExpensesUseCase
  let getExpensesController: ReturnType<typeof GetExpensesController>

  let req: Request
  let res: Response

  const userId = 'userId'

  const noPaidExpense = new Expense({
    description: 'test no paid expense',
    cost: 50,
    paid: false
  })

  const paidExpense = new Expense({
    description: 'test paid expense',
    cost: 50,
    paid: false
  })

  beforeEach(() => {
    getExpensesUseCase = {
      execute: jest.fn(({ ownerId, strategy }: IGetExpensesDTO) => {
        if (ownerId !== userId) return Promise.resolve([])

        if (strategy === 'paid') return Promise.resolve([paidExpense])

        if (strategy === 'no paid') return Promise.resolve([noPaidExpense])

        return Promise.resolve([paidExpense, noPaidExpense])
      })
    }

    req = {
      headers: {
        userId
      },
      query: {}
    } as unknown as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response

    getExpensesController = GetExpensesController(getExpensesUseCase)
  })

  it('should return status 200 and all expenses if not strategy is provided', async () => {
    await getExpensesController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expenses: [
        {
          id: paidExpense.id,
          description: paidExpense.description,
          cost: paidExpense.cost,
          paid: paidExpense.paid,
          paidAt: paidExpense.paidAt,
          ownerId: userId
        },
        {
          id: noPaidExpense.id,
          description: noPaidExpense.description,
          cost: noPaidExpense.cost,
          paid: noPaidExpense.paid,
          paidAt: noPaidExpense.paidAt,
          ownerId: userId
        }
      ]
    })
  })

  it('should return status 200 and paid expenses if strategy is "paid"', async () => {
    req.query.strategy = 'paid'

    await getExpensesController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expenses: [
        {
          id: paidExpense.id,
          description: paidExpense.description,
          cost: paidExpense.cost,
          paid: paidExpense.paid,
          paidAt: paidExpense.paidAt,
          ownerId: userId
        }
      ]
    })
  })

  it('should return status 200 and no paid expenses if strategy is "no paid"', async () => {
    req.query.strategy = 'no paid'

    await getExpensesController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expenses: [
        {
          id: noPaidExpense.id,
          description: noPaidExpense.description,
          cost: noPaidExpense.cost,
          paid: noPaidExpense.paid,
          paidAt: noPaidExpense.paidAt,
          ownerId: userId
        }
      ]
    })
  })

  it('should return status 200 and all expenses if strategy is different than "paid" and "no paid"', async () => {
    req.query.strategy = 'other strategy'

    await getExpensesController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expenses: [
        {
          id: paidExpense.id,
          description: paidExpense.description,
          cost: paidExpense.cost,
          paid: paidExpense.paid,
          paidAt: paidExpense.paidAt,
          ownerId: userId
        },
        {
          id: noPaidExpense.id,
          description: noPaidExpense.description,
          cost: noPaidExpense.cost,
          paid: noPaidExpense.paid,
          paidAt: noPaidExpense.paidAt,
          ownerId: userId
        }
      ]
    })
  })

  it('should return an empty list if the owner have no expenses registered', async () => {
    req.headers.userId = 'user without expenses'

    await getExpensesController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      expenses: []
    })
  })

  it('should return status 500 and error message if an error thrown getting the expenses', async () => {
    getExpensesUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('error getting expenses'))

    await getExpensesController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'error getting expenses' })
  })
})
