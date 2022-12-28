export interface IEditExpenseDTO {
  ownerId: string
  expenseId: string
  description?: string
  cost?: number
  paid?: boolean
  paidAt?: Date
}
