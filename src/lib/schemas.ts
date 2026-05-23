import { z } from '@hono/zod-openapi'

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const registerBody = z.object({
  name: z.string().min(1).max(255).openapi({ example: 'John' }),
  email: z.string().email().max(255).openapi({ example: 'john@example.com', format: 'email' }),
  password: z.string().min(6).openapi({ example: 'secret123' }),
})

export const loginBody = z.object({
  email: z.string().email().openapi({ example: 'john@example.com' }),
  password: z.string().min(1).openapi({ example: 'secret123' }),
})

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------
export const createItemBody = z.object({
  name: z.string().min(1).max(255).openapi({ example: 'Laptop' }),
  description: z.string().max(1000).nullable().optional().openapi({ example: 'A great laptop' }),
  price: z.number().min(0).openapi({ example: 999.99 }),
  userId: z.number().int().nullable().optional().openapi({ example: 1 }),
})

export const updateItemBody = z.object({
  name: z.string().min(1).max(255).optional().openapi({ example: 'Updated Laptop' }),
  description: z.string().max(1000).nullable().optional().openapi({ example: 'Updated description' }),
  price: z.number().min(0).optional().openapi({ example: 899.99 }),
  userId: z.number().int().nullable().optional().openapi({ example: 1 }),
})

export const itemParams = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
})

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const createUserBody = z.object({
  name: z.string().min(1).max(255).openapi({ example: 'Jane' }),
  email: z.string().email().max(255).openapi({ example: 'jane@example.com' }),
})

export const updateUserBody = z.object({
  name: z.string().min(1).max(255).optional().openapi({ example: 'Jane Updated' }),
  email: z.string().email().max(255).optional().openapi({ example: 'jane.updated@example.com' }),
})

export const userParams = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
})

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notificationBody = z.object({
  token: z.string().optional().openapi({ example: 'fcm-token...' }),
  title: z.string().min(1).max(255).openapi({ example: 'Hello' }),
  body: z.string().min(1).max(1000).openapi({ example: 'World' }),
  data: z.record(z.string(), z.unknown()).nullable().optional().openapi({ example: { key: 'value' } }),
})

export const registerTokenBody = z.object({
  token: z.string().min(1).openapi({ example: 'fcm-device-token...' }),
  device: z.string().nullable().optional().openapi({ example: 'android' }),
})

// ---------------------------------------------------------------------------
// Common response schemas
// ---------------------------------------------------------------------------
export const errorSchema = z.object({
  error: z.string().openapi({ example: 'Error message' }),
}).openapi('Error')

export const authResponse = z.object({
  token: z.string().openapi({ example: 'eyJhbGciOi...' }),
  user: z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'John' }),
    email: z.string().openapi({ example: 'john@example.com' }),
  }),
}).openapi('AuthResponse')
