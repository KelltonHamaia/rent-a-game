import { CategoryRepository } from '@/modules/categories/application/ports/repository/category.repository.js'
import {
  NewCategory,
  normalizeCategory,
} from '@/modules/categories/domain/entities/category.entity.js'
import { CATEGORIES_ERRORS } from '@/modules/categories/domain/errors/categories-errors.js'
import { Either } from '@/modules/shared/errors/Either.js'

export const createCategoryUsecase = (categoryRepository: CategoryRepository) => {
  return async ({ name }: NewCategory) => {
    const normalizedCategory = normalizeCategory({ name })

    const categoryExists = await categoryRepository.findByName(name)
    if (categoryExists) {
      return Either.Left(CATEGORIES_ERRORS.CATEGORY_ALREADY_EXISTS)
    }

    const result = await categoryRepository.create({ ...normalizedCategory })
    return Either.Right(result)
  }
}
