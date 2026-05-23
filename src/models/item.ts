import prisma from '../db.js'
import type { Prisma } from '../generated/prisma/client'

export const Item = {
  list() {
    return prisma.item.findMany()
  },
  findById(id: number) {
    return prisma.item.findUnique({ where: { id } })
  },
  create(data: Prisma.ItemCreateInput) {
    return prisma.item.create({ data })
  },
  update(id: number, data: Prisma.ItemUpdateInput) {
    return prisma.item.update({ where: { id }, data })
  },
  delete(id: number) {
    return prisma.item.delete({ where: { id } })
  },
}
