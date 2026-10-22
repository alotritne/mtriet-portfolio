// Local, disposable database for browser verification. Never uses .env credentials.
import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongo = await MongoMemoryServer.create()
process.env.MONGODB_URI = mongo.getUri()
process.env.MONGODB_DB = 'browser_tests'
process.env.JWT_ACCESS_SECRET = randomBytes(32).toString('hex')
process.env.JWT_REFRESH_SECRET = randomBytes(32).toString('hex')
process.env.NODE_ENV = 'test'
process.env.PORT = '3000'
process.env.FRONTEND_ORIGIN = 'http://localhost:5173'
const { getDb, ensureIndexes, closeDatabase } = await import('../src/db.js')
await ensureIndexes()
await (await getDb()).collection('admins').insertOne({ email: 'browser-test@example.test', passwordHash: await bcrypt.hash('local-browser-test-only', 10), role: 'admin', createdAt: new Date(), updatedAt: new Date() })
const app = (await import('../src/app.js')).default
const server = app.listen(3000, '127.0.0.1', () => console.log('Disposable browser fixture ready on 127.0.0.1:3000'))
const stop = () => server.close(async () => { await closeDatabase(); await mongo.stop(); process.exit(0) })
process.on('SIGTERM', stop)
process.on('SIGINT', stop)
