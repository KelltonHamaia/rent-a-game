import { CategoryRepository } from '@/modules/categories/application/ports/repository/category.repository.js'
import { createCategoryUsecase } from '@/modules/categories/application/use-cases/create-category.usecase.js'
import {
  Category,
  NewCategory,
} from '@/modules/categories/domain/entities/category.entity.js'
import { CATEGORIES_ERRORS } from '@/modules/categories/domain/errors/categories-errors.js'
import { describe, expect, it, vi } from 'vitest'

describe('Create category usecase', () => {
  const makeSut = () => {
    const categoryRepository = {
      create: vi.fn<CategoryRepository['create']>(),
      findByName: vi.fn<CategoryRepository['findByName']>().mockResolvedValue(null),
      update: vi.fn<CategoryRepository['update']>(),
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

  it('Should return a Left Either if the category already exists', async () => {
    const { categoryRepository, sut } = makeSut()
    categoryRepository.findByName.mockResolvedValue(category)

    const output = await sut(normalizedCategory)

    expect(output.right).toBeNull()
    expect(output.left).toEqual(CATEGORIES_ERRORS.CATEGORY_ALREADY_EXISTS)

    expect(categoryRepository.findByName).toHaveBeenCalledTimes(1)
    expect(categoryRepository.findByName).toHaveBeenCalledWith(normalizedCategory.name)

    expect(categoryRepository.create).not.toHaveBeenCalled()
  })
})
