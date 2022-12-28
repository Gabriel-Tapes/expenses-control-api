import { authenticateUserController } from '@useCases/usersUseCases/authenticateUser'
import { Router } from 'express'
import { usersRouter } from './usersRoutes'
import { expensesRouter } from './expensesRoutes'
import { gainsRouter } from './gainsRoutes'

export const router = Router()

router.post('/auth', (req, res) => {
  return authenticateUserController.handle(req, res)
})

router.use('/users', usersRouter)
router.use('/expenses', expensesRouter)
router.use('/gains', gainsRouter)
