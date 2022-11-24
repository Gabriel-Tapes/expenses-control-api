import { v4 as uuidv4 } from 'uuid'

export interface GainProps {
  id: string
  value: number
  gainedAt?: Date
}

export class Gain {
  private props: GainProps

  get id() {
    return this.props.id
  }

  get value() {
    return this.props.value
  }

  set value(newValue: number) {
    if (newValue < 0)
      throw new Error(
        'Gain value field error: the value field must be positive'
      )

    this.props.value = newValue
  }

  get gainedAt() {
    return this.props.gainedAt
  }

  set gainedAt(newgainedAt: Date) {
    if (!newgainedAt)
      throw new Error('Gain gainedAt error, the gainedAt field cannot be blank')
    this.props.gainedAt = newgainedAt
  }

  constructor({ value, gainedAt }: Omit<GainProps, 'id'>, id?: string) {
    if (value < 0)
      throw new Error(
        'Gain value field error: the value field must be positive'
      )

    this.props = {
      id: id || uuidv4(),
      value,
      gainedAt: gainedAt || new Date()
    }
  }
}
