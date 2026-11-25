import { CategoryRepository } from '@/modules/categories/application/ports/repository/category.repository.js'
import {
  Category,
  normalizeCategory,
} from '@/modules/categories/domain/entities/category.entity.js'
import { Either } from '@/modules/shared/errors/Either.js'

export const updateCategoryUsecase = (categoryRepository: CategoryRepository) => {
  return async ({ id, name }: Category) => {
    const normalizedCategory = normalizeCategory({ name })
    const result = await categoryRepository.update({ id, name: normalizedCategory.name })

    return Either.Right(result)
  }
}
