import { InMemoryExpensesRepository } from '@repositories/inMemory/inMemoryExpensesRepository'
import { RegisterExpenseUseCase } from './registerExpenseUseCase'

describe('Register Expense use case test', () => {
  it('should be able to register an expense', async () => {
    const expensesRepository = InMemoryExpensesRepository()
    const registerExpenseUseCase = RegisterExpenseUseCase(expensesRepository)

    const registeredExpense = await registerExpenseUseCase.execute({
      ownerId: 'userId',
      description: 'test expense',
      cost: 50,
      paid: false
    })

    const gottenExpense = await expensesRepository.getExpenseById(
      'userId',
      registeredExpense.id
    )

    expect(gottenExpense).toBeTruthy()
    expect(gottenExpense).toEqual(registeredExpense)
  })

  it('should not be able to register an expense with negative cost field', async () => {
    const expensesRepository = InMemoryExpensesRepository()
    const registerExpenseUseCase = RegisterExpenseUseCase(expensesRepository)

    await expect(async () => {
      return await registerExpenseUseCase.execute({
        ownerId: 'userId',
        description: 'test expense',
        cost: -50,
        paid: false
      })
    }).rejects.toThrow()
  })
})
