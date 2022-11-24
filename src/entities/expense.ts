import { v4 as uuidv4 } from 'uuid'

export interface ExpenseProps {
  id: string
  description: string
  cost: number
  paid: boolean
  paidAt?: Date
}

export class Expense {
  private props: ExpenseProps

  get id() {
    return this.props.id
  }

  get description() {
    return this.props.description
  }

  set description(newDescription: string) {
    if (!newDescription)
      throw new Error(
        'Expense description error, the description field cannot be blank'
      )

    this.props.description = newDescription
  }

  get cost() {
    return this.props.cost
  }

  set cost(newCost: number) {
    if (!newCost)
      throw new Error('Expense cost error, the cost field cannot be blank')

    this.props.cost = newCost
  }

  get paid() {
    return this.props.paid
  }

  set paid(newPaid: boolean) {
    if (newPaid === undefined || newPaid === null)
      throw new Error('Expense paid error, the paid field cannot be blank')

    this.props.paid = newPaid
    if (newPaid) this.paidAt = new Date()
  }

  get paidAt() {
    if (!this.paid) return null

    return this.props.paidAt
  }

  set paidAt(newPaidAt: Date) {
    if (!newPaidAt)
      throw new Error('Expense paidAt error, the paidAt field cannot be blank')

    if (!this.paid) this.props.paid = true
    this.props.paidAt = newPaidAt
  }

  constructor(
    { description, cost, paid, paidAt }: Omit<ExpenseProps, 'id'>,
    id?: string
  ) {
    if (!description || cost < 0)
      throw new Error('Expense blank field error: all fields must be filled')

    if (paid) paidAt = paidAt || new Date()
    else paidAt = null

    this.props = {
      id: id || uuidv4(),
      description,
      cost,
      paid,
      paidAt
    }
  }
}
