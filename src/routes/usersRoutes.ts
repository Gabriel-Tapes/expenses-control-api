import { authMiddlewareController } from '@useCases/auth/authMiddleware'
import { createUserController } from '@useCases/usersUseCases/createUser'
import { deleteUserController } from '@useCases/usersUseCases/deleteUser'
import { editUserController } from '@useCases/usersUseCases/editUser'
import { getUserController } from '@useCases/usersUseCases/getUser'
import { Router } from 'express'

export const usersRouter = Router()

usersRouter.post('/', (req, res) => {
  return createUserController.handle(req, res)
})

usersRouter.use((req, res, next) => {
  authMiddlewareController.handle(req, res, next)
})

usersRouter.put('/', (req, res) => {
  editUserController.handle(req, res)
})

usersRouter.get('/', (req, res) => {
  return getUserController.handle(req, res)
})

usersRouter.delete('/', (req, res) => {
  return deleteUserController.handle(req, res)
})
