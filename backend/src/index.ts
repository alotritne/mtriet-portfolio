import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { closeDatabase, ensureIndexes } from './db.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
const allowedOrigins = env.FRONTEND_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}))
app.use(express.json({ limit: '256kb' }))
app.use(cookieParser())

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found' }))
app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  void _next
  console.error(error)
  response.status(500).json({ error: 'Internal server error' })
})

await ensureIndexes()
const server = app.listen(env.PORT, () => console.log(`Portfolio API listening on port ${env.PORT}`))

process.on('SIGTERM', () => {
  server.close(async () => {
    await closeDatabase()
    process.exit(0)
  })
})
