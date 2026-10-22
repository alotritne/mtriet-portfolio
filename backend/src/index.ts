import app from './app.js'
import { env } from './config/env.js'
import { closeDatabase, ensureIndexes } from './db.js'
import { databaseErrorMessage } from './database-error.js'

try {
  await ensureIndexes()
  const server = app.listen(env.PORT, () => console.log(`Portfolio API listening on port ${env.PORT}`))

  process.on('SIGTERM', () => {
    server.close(async () => {
      await closeDatabase()
      process.exit(0)
    })
  })
} catch (error) {
  console.error(databaseErrorMessage(error))
  await closeDatabase()
  process.exitCode = 1
}
