import { MongoClient } from 'mongodb'
import { env } from '../config/env.js'
import { databaseErrorMessage } from '../database-error.js'

const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 })
try {
  await client.db(env.MONGODB_DB).command({ ping: 1 })
  console.log('Kết nối và xác thực MongoDB thành công. Kiểm tra này không sửa dữ liệu.')
} catch (error) {
  console.error(databaseErrorMessage(error))
  process.exitCode = 1
} finally {
  await client.close()
}
