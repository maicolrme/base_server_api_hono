import type { Context } from 'hono'
import { UserService } from '../services/user.js'
import * as s from '../lib/schemas.js'

const svc = new UserService()

export async function list(c: Context) {
  return c.json(await svc.list())
}

export async function show(c: Context) {
  const id = Number(c.req.param('id'))
  const user = await svc.findById(id)
  return c.json(user ?? { error: 'User not found' }, user ? 200 : 404)
}

export async function store(c: Context) {
  const body = s.createUserBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)
  return c.json(await svc.create(body.data), 201)
}

export async function update(c: Context) {
  const body = s.updateUserBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)
  return c.json(await svc.update(Number(c.req.param('id')), body.data))
}

export async function destroy(c: Context) {
  await svc.delete(Number(c.req.param('id')))
  return c.body(null, 204)
}
