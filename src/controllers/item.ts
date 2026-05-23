import type { Context } from 'hono'
import { ItemService } from '../services/item.js'
import * as s from '../lib/schemas.js'

const svc = new ItemService()

export async function list(c: Context) {
  return c.json(await svc.list())
}

export async function show(c: Context) {
  const id = Number(c.req.param('id'))
  const item = await svc.findById(id)
  return c.json(item ?? { error: 'Item not found' }, item ? 200 : 404)
}

export async function store(c: Context) {
  const body = s.createItemBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)
  return c.json(await svc.create(body.data), 201)
}

export async function update(c: Context) {
  const body = s.updateItemBody.safeParse(await c.req.json())
  if (!body.success) return c.json({ error: 'Validation error', details: body.error.flatten() }, 400)
  return c.json(await svc.update(Number(c.req.param('id')), body.data))
}

export async function destroy(c: Context) {
  await svc.delete(Number(c.req.param('id')))
  return c.body(null, 204)
}
