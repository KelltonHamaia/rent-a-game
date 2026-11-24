import type {
  NewCategory,
  Category,
} from '@/modules/categories/domain/entities/category.entity.js'

export type CategoryRepository = {
  create: (newCategory: NewCategory) => Promise<Category>
  findByName: (name: string) => Promise<Category | null>
}
