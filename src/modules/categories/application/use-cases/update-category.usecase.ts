import { CategoryRepository } from '@/modules/categories/application/ports/repository/category.repository.js'
import {
  Category,
  normalizeCategory,
} from '@/modules/categories/domain/entities/category.entity.js'
import { CATEGORIES_ERRORS } from '@/modules/categories/domain/errors/categories-errors.js'
import { Either } from '@/modules/shared/errors/Either.js'

export const updateCategoryUsecase = (categoryRepository: CategoryRepository) => {
  return async ({ id, name }: Category) => {
    const normalizedCategory = normalizeCategory({ name })

    if (await categoryRepository.findByName(normalizedCategory.name)) {
      return Either.Left(CATEGORIES_ERRORS.CATEGORY_ALREADY_EXISTS)
    }

    const result = await categoryRepository.update({ id, name: normalizedCategory.name })
    return Either.Right(result)
  }
}
