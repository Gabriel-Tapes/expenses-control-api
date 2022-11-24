import { Expense } from './expense'

describe('Expense entity tests', () => {
  it('should be able to create an Expense instance', () => {
    const expense = new Expense({
      description: 'burger',
      cost: 13.0,
      paid: true
    })

    expect(expense).toBeInstanceOf(Expense)
    expect(expense.description).toBe('burger')
  })

  it('should be the paidAt field null if paid field is false', () => {
    const expense = new Expense({
      description: 'burger',
      cost: 13.0,
      paid: false
    })

    expect(expense.paidAt).toBeNull()

    const newExpense = new Expense({
      description: 'burger',
      cost: 13.0,
      paid: false,
      paidAt: new Date()
    })

    expect(newExpense.paidAt).toBeNull()
  })

  it('should not be able to create an expense with description field blank', () => {
    expect(() => {
      return new Expense({
        description: '',
        cost: 13.0,
        paid: false
      })
    }).toThrow()
  })

  it('should not be able to create an expense with cost field negative', () => {
    expect(() => {
      return new Expense({
        description: 'burger',
        cost: -13.0,
        paid: false
      })
    }).toThrow()
  })

  it('should be setted value to paidAt when paid is setted true', () => {
    const expense = new Expense({
      description: 'burger',
      cost: 13.0,
      paid: false
    })

    expense.paid = true

    expect(expense.paidAt).not.toBeNull()
  })

  it('should be paid field set to true when paidAt field is setted', () => {
    const expense = new Expense({
      description: 'burger',
      cost: 13.0,
      paid: false
    })

    expense.paidAt = new Date()

    expect(expense.paid).toBe(true)
  })
})
