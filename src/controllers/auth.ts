import type { Context } from 'hono'
import { AuthService, ConflictError, UnauthorizedError, NotFoundError } from '../services/auth.js'
import * as s from '../lib/schemas.js'

const svc = new AuthService()

export async function register(c: Context) {
  const body = s.registerBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)

  try {
    return c.json(await svc.register(body.data), 201)
  } catch (e) {
    if (e instanceof ConflictError) return c.json({ error: e.message }, e.status as any)
    throw e
  }
}

export async function login(c: Context) {
  const body = s.loginBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)

  try {
    return c.json(await svc.login(body.data))
  } catch (e) {
    if (e instanceof UnauthorizedError) return c.json({ error: e.message }, e.status as any)
    throw e
  }
}

export async function me(c: Context) {
  const { sub } = c.get('jwtPayload') as { sub: string }
  try {
    return c.json(await svc.me(Number(sub)))
  } catch (e) {
    if (e instanceof NotFoundError) return c.json({ error: e.message }, e.status as any)
    throw e
  }
}
