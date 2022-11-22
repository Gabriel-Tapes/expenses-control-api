import { join as joinPath } from 'path'
import { readdir, readFile } from 'fs'
import { createDatabaseConnection } from './connectDatabase'
;(async () => {
  const client = await createDatabaseConnection()

  const fileDatabaseDir = joinPath(__dirname, 'migrations')

  console.log('start migrations', new Date())

  readdir(fileDatabaseDir, (err, files) => {
    if (err) console.error(err)

    files.forEach(file => {
      readFile(joinPath(fileDatabaseDir, file), async (err, content) => {
        if (err) console.error(err)

        const runMigrationQuery = content.toString()
        await client.query(runMigrationQuery)
      })
    })
  })

  console.log('finish migrations', new Date())
})()
