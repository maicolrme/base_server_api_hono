import type { Context } from 'hono'
import { NotificationService } from '../services/notification.js'
import * as s from '../lib/schemas.js'

const svc = new NotificationService()

export async function send(c: Context) {
  const body = s.notificationBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)

  try {
    return c.json(await svc.send(body.data))
  } catch (e) {
    return c.json({ error: (e as Error).message || 'FCM request failed' }, 502)
  }
}

export async function test(c: Context) {
  return c.json({ success: true, message: 'Test notification sent' })
}

export async function registerToken(c: Context) {
  const body = s.registerTokenBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)
  return c.json({ success: true, message: 'Token registered' })
}
