import prisma from '../db.js'

export const User = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },
  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    })
  },
  list() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    })
  },
  create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data })
  },
  update(id: number, data: Partial<{ name: string; email: string }>) {
    return prisma.user.update({ where: { id }, data })
  },
  delete(id: number) {
    return prisma.user.delete({ where: { id } })
  },
}
