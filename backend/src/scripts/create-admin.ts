import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getDb } from '../db.js'
import type { AdminDocument } from '../types.js'

const input = z.object({ ADMIN_EMAIL: z.string().email(), ADMIN_PASSWORD: z.string().min(12).max(128) }).safeParse(process.env)
if (!input.success) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before running this command')

const email = input.data.ADMIN_EMAIL.toLowerCase()
const db = await getDb()
const now = new Date()
const passwordHash = await bcrypt.hash(input.data.ADMIN_PASSWORD, 12)
await db.collection<AdminDocument>('admins').updateOne(
  { email },
  { $set: { passwordHash, role: 'admin', updatedAt: now }, $setOnInsert: { email, createdAt: now } },
  { upsert: true },
)
console.log(`Admin account is ready: ${email}`)
process.exit(0)
