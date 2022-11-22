import 'dotenv/config'
import { Pool } from 'pg'

export const createDatabaseConnection = async () => {
  const client = new Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT!),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  })

  await client.connect()

  return client
}
