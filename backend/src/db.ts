import { MongoClient } from 'mongodb'
import { env } from './config/env.js'

const client = new MongoClient(env.MONGODB_URI)
let connection: Promise<MongoClient> | undefined

export function getClient() {
  connection ??= client.connect()
  return connection
}

export async function getDb() {
  const connected = await getClient()
  return connected.db(env.MONGODB_DB)
}

export async function ensureIndexes() {
  const db = await getDb()
  await Promise.all([
    db.collection('admins').createIndex({ email: 1 }, { unique: true }),
    db.collection('refreshTokens').createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection('refreshTokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection('projects').createIndex({ slug: 1 }, { unique: true }),
    db.collection('projects').createIndex({ published: 1, position: 1 }),
  ])
}

export async function closeDatabase() {
  if (connection) await client.close()
}
