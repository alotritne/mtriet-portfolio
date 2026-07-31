import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1),
  MONGODB_DB: z.string().min(1).default('portfolio'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  const keys = parsed.error.issues.map(issue => issue.path.join('.')).join(', ')
  throw new Error(`Invalid backend environment variables: ${keys}`)
}

export const env = parsed.data
export const isProduction = env.NODE_ENV === 'production'
