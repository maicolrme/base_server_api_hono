import 'dotenv/config'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import type { JwtVariables } from 'hono/jwt'
import { auth } from './middleware/auth.js'
import { register } from './routes/index.js'

const app = new OpenAPIHono<{ Variables: JwtVariables }>()

app.use('*', logger(), cors())

// Auth middleware — before routes
app.use('/auth/me', auth)
app.use('/users/*', auth)
app.use('/notifications/*', auth)
app.use('/items', async (c, next) => {
  if (c.req.method !== 'GET') await auth(c, next)
  else await next()
})
app.use('/items/:id', auth)

register(app)

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get('/', (c) => c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hono API</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center}
    h1{font-size:2.5rem;font-weight:700;margin-bottom:.5rem;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    p{color:#94a3b8;margin-bottom:2rem;font-size:1.1rem}
    .links{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center}
    .links a{padding:.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;transition:.2s}
    .btn-docs{background:#2563eb;color:#fff}.btn-docs:hover{background:#1d4ed8}
    .btn-health{background:#1e293b;color:#e2e8f0;border:1px solid #334155}.btn-health:hover{background:#334155}
    .features{display:flex;gap:2rem;margin-top:3rem;flex-wrap:wrap;justify-content:center}
    .feature{background:#1e293b;padding:1.25rem 2rem;border-radius:12px;min-width:200px;border:1px solid #334155}
    .feature h3{font-size:1rem;color:#60a5fa;margin-bottom:.5rem}
    .feature span{font-size:.85rem;color:#94a3b8}
  </style>
</head>
<body>
  <h1>Hono API Server</h1>
  <p>REST API — Hono + Prisma + PostgreSQL + JWT</p>
  <div class="links">
    <a href="/ui" class="btn-docs">Swagger Docs</a>
    <a href="/health" class="btn-health">Health Check</a>
  </div>
  <div class="features">
    <div class="feature"><h3>Auth</h3><span>JWT Bearer</span></div>
    <div class="feature"><h3>Database</h3><span>PostgreSQL + Prisma</span></div>
    <div class="feature"><h3>Docs</h3><span>OpenAPI + Swagger</span></div>
    <div class="feature"><h3>Push</h3><span>FCM Notifications</span></div>
  </div>
</body>
</html>`))

app.doc('/doc', {
  openapi: '3.0.0',
  info: { title: 'Hono API', version: '1.0.0', description: 'REST API with Hono + Prisma' },
  servers: [{ url: `http://localhost:${process.env.PORT || 3001}` }],
  security: [{ BearerAuth: [] }],
})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
