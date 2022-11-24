import { v4 as uuidv4 } from 'uuid'

export interface UserProps {
  id: string
  name: string
  lastName: string
  email: string
  password: string
}

export class User {
  private props: UserProps

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  set name(newName: string) {
    if (!newName)
      throw new Error('User name error, the name field cannot be blank')

    this.props.name = newName
  }

  get lastName() {
    return this.props.lastName
  }

  set lastName(newLastName: string) {
    if (!newLastName)
      throw new Error('user lastName error, the lastName field cannot be blank')

    this.props.lastName = newLastName
  }

  get email() {
    return this.props.email
  }

  set email(newEmail: string) {
    if (!newEmail)
      throw new Error('user email error, the email field cannot be blank')

    this.props.email = newEmail
  }

  get password() {
    return this.props.password
  }

  set password(newPassword: string) {
    if (!newPassword)
      throw new Error('user password error, the password field cannot be blank')

    this.props.password = newPassword
  }

  constructor(
    { name, lastName, email, password }: Omit<UserProps, 'id'>,
    id?: string
  ) {
    if (!(name && lastName && email && password))
      throw new Error('user blank field error: all fields must be filled')

    this.props = {
      id: id || uuidv4(),
      name,
      lastName,
      email,
      password
    }
  }
}
