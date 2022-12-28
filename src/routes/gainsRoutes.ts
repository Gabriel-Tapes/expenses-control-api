import { authMiddlewareController } from '@useCases/auth/authMiddleware'
import { deleteGainController } from '@useCases/gainsUseCases/deleteGain'
import { editGainController } from '@useCases/gainsUseCases/editGain'
import { getAllGainsController } from '@useCases/gainsUseCases/getAllGains'
import { getGainController } from '@useCases/gainsUseCases/getGain'
import { registerGainController } from '@useCases/gainsUseCases/registerGain'
import { Router } from 'express'

export const gainsRouter = Router()

gainsRouter.use((req, res, next) => {
  authMiddlewareController.handle(req, res, next)
})

gainsRouter.post('/', (req, res) => {
  return registerGainController.handle(req, res)
})

gainsRouter.get('/', (req, res) => {
  if (req.query.gainId) return getGainController.handle(req, res)
  return getAllGainsController.handle(req, res)
})

gainsRouter.patch('/', (req, res) => {
  return editGainController.handle(req, res)
})

gainsRouter.delete('/', (req, res) => {
  return deleteGainController.handle(req, res)
})
