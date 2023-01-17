import { promisify } from 'util'
import * as fs from 'fs'
import { join as joinPath } from 'path'
import { createDatabaseConnection } from './connectDatabase'
import { Pool } from 'pg'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

export const runMigrations = async (connection?: Pool) => {
  const client = connection ?? (await createDatabaseConnection())
  const fileDatabaseDir = joinPath(__dirname, 'migrations')
  try {
    const files = await readdir(fileDatabaseDir)

    await Promise.all(
      files.map(async file => {
        const content = await readFile(joinPath(fileDatabaseDir, file), 'utf8')
        const migrationQuery = content.toString()

        return client.query(migrationQuery)
      })
    )
  } catch (err) {
    console.error(err)
  }
}
