import express from 'express'
import cors from 'cors'
import { router } from './routes'
import './database/runMigrations'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(router)
