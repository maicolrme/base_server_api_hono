import { User } from '../models/user.js'

export class UserService {
  list() { return User.list() }

  findById(id: number) {
    return User.findById(id)
  }

  create(data: { name: string; email: string }) {
    return User.create({ ...data, password: 'temporary' })
  }

  update(id: number, data: Partial<{ name: string; email: string }>) {
    return User.update(id, data)
  }

  delete(id: number) {
    return User.delete(id)
  }
}
