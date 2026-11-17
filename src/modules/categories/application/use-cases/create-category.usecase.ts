import { CategoryRepository } from '@/modules/categories/application/ports/repository/category.repository.js'
import {
  NewCategory,
  normalizeCategory,
} from '@/modules/categories/domain/entities/category.entity.js'
import { Either } from '@/modules/shared/errors/Either.js'

export const createCategoryUsecase = (categoryRepository: CategoryRepository) => {
  return async ({ name }: NewCategory) => {
    const normalizedCategory = normalizeCategory({ name })
    const result = await categoryRepository.create({ ...normalizedCategory })
    return Either.Right(result)
  }
}
