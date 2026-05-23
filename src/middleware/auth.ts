import { jwt } from 'hono/jwt'

export const auth = jwt({ secret: process.env.JWT_SECRET!, alg: 'HS256' })
