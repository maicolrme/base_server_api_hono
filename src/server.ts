import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './index.js'

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3001 }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})
