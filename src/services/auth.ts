import bcrypt from 'bcryptjs'
import { sign } from 'hono/jwt'
import { User } from '../models/user.js'

export class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const exists = await User.findByEmail(data.email)
    if (exists) throw new ConflictError('Email already registered')

    const hashed = await bcrypt.hash(data.password, 10)
    const user = await User.create({ ...data, password: hashed })

    return {
      token: await this.token(user.id, user.email),
      user: { id: user.id, name: user.name, email: user.email },
    }
  }

  async login(data: { email: string; password: string }) {
    const user = await User.findByEmail(data.email)
    if (!user) throw new UnauthorizedError('Invalid email or password')

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) throw new UnauthorizedError('Invalid email or password')

    return {
      token: await this.token(user.id, user.email),
      user: { id: user.id, name: user.name, email: user.email },
    }
  }

  async me(userId: number) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User not found')
    return user
  }

  private token(id: number, email: string) {
    return sign({ sub: id, email }, process.env.JWT_SECRET!, 'HS256')
  }
}

export class ConflictError extends Error { status = 409 }
export class UnauthorizedError extends Error { status = 401 }
export class NotFoundError extends Error { status = 404 }
