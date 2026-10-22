import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import postRoutes from './routes/posts.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
const allowedOrigins = new Set(
  env.FRONTEND_ORIGIN.split(',').map(origin => new URL(origin.trim()).origin),
)
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/posts', postRoutes)
app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found' }))
app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  void _next
  if (error instanceof Error && error.message === 'Origin is not allowed by CORS') {
    return response.status(403).json({ error: error.message })
  }
  if (error instanceof Error && 'type' in error && error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Request body is too large' })
  }
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    return response.status(400).json({ error: 'Invalid JSON body' })
  }
  console.error(error)
  return response.status(500).json({ error: 'Internal server error' })
})


export default app
