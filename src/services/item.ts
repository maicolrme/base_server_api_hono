import { Item } from '../models/item.js'
import type { Prisma } from '../generated/prisma/client'

export class ItemService {
  list() { return Item.list() }

  findById(id: number) {
    return Item.findById(id)
  }

  create(data: Prisma.ItemCreateInput) {
    return Item.create(data)
  }

  update(id: number, data: Prisma.ItemUpdateInput) {
    return Item.update(id, data)
  }

  delete(id: number) {
    return Item.delete(id)
  }
}
