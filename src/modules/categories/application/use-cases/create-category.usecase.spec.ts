import { CategoryRepository } from '@/modules/categories/application/ports/repository/category.repository.js'
import { createCategoryUsecase } from '@/modules/categories/application/use-cases/create-category.usecase.js'
import {
  Category,
  NewCategory,
} from '@/modules/categories/domain/entities/category.entity.js'
import { describe, expect, it, vi } from 'vitest'

describe('Create category usecase', () => {
  const makeSut = () => {
    const categoryRepository = {
      create: vi.fn<CategoryRepository['create']>(),
    } satisfies CategoryRepository

    const sut = createCategoryUsecase(categoryRepository)
    return { categoryRepository, sut }
  }

  const unnormalizedCategory: NewCategory = {
    name: 'action',
  }

  const normalizedCategory: NewCategory = {
    name: 'ACTION',
  }

  const category: Category = {
    id: '01a1e75b-9ed3-7654-9a09-46b6a67999ec',
    name: normalizedCategory.name.toUpperCase(),
  }

  it('Should create a new category', async () => {
    const { categoryRepository, sut } = makeSut()
    categoryRepository.create.mockResolvedValue(category)

    const output = await sut(unnormalizedCategory)

    expect(output.right).toEqual({ result: category })
    expect(output.left).toBeNull()

    expect(categoryRepository.create).toHaveBeenCalledWith(normalizedCategory)
    expect(categoryRepository.create).toHaveBeenCalledTimes(1)
  })
})
