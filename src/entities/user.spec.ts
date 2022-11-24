import { User } from './user'

describe('Entity user tests', () => {
  it('should be able to create an user', () => {
    const user = new User({
      name: 'Joe',
      lastName: 'Doe',
      email: 'joe.doe@email.com',
      password: 'qwerty123'
    })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toEqual('Joe')
  })

  it('should not be able to create an user with name field blank', () => {
    expect(() => {
      return new User({
        name: '',
        lastName: 'Doe',
        email: 'joe.doe@email.com',
        password: 'qwerty123'
      })
    }).toThrow()
  })

  it('should not be able to create an user with lastName field blank', () => {
    expect(() => {
      return new User({
        name: 'Joe',
        lastName: '',
        email: 'joe.doe@email.com',
        password: 'qwerty123'
      })
    }).toThrow()
  })

  it('should not be able to create an user with email field blank', () => {
    expect(() => {
      return new User({
        name: 'Joe',
        lastName: 'Doe',
        email: '',
        password: 'qwerty123'
      })
    }).toThrow()
  })

  it('should not be able to create an user with password field blank', () => {
    expect(() => {
      return new User({
        name: 'Joe',
        lastName: 'Doe',
        email: 'joe.doe@email.com',
        password: ''
      })
    }).toThrow()
  })
})
