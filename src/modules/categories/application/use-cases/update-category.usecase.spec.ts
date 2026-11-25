import { CategoryRepository } from '@/modules/categories/application/ports/repository/category.repository.js'
import { updateCategoryUsecase } from '@/modules/categories/application/use-cases/update-category.usecase.js'
import { Category } from '@/modules/categories/domain/entities/category.entity.js'
import { vi, it, expect, describe } from 'vitest'

describe('Update category usecase', () => {
  const makeSut = () => {
    let categoryRepository = {
      create: vi.fn<CategoryRepository['create']>(),
      findByName: vi.fn<CategoryRepository['findByName']>().mockResolvedValue(null),
      update: vi.fn<CategoryRepository['update']>(),
    } satisfies CategoryRepository

    const sut = updateCategoryUsecase(categoryRepository)

    return {
      sut,
      categoryRepository,
    }
  }

  const category: Category = {
    id: '01a20b60-c014-768b-8de4-e14bb39e086e',
    name: 'rpg',
  }

  const normalizedCategory: Category = {
    ...category,
    name: category.name.toUpperCase(),
  }

  const updatedCategory: Category = {
    id: '01a20b60-c014-768b-8de4-e14bb39e086e',
    name: 'RPG',
  }

  it('Should update a category', async () => {
    const { categoryRepository, sut } = makeSut()
    categoryRepository.update.mockResolvedValue(updatedCategory)
    const output = await sut(category)

    expect(output.left).toBeNull()
    expect(output.right).toEqual({ result: updatedCategory })

    expect(categoryRepository.update).toHaveBeenCalledTimes(1)
    expect(categoryRepository.update).toHaveBeenCalledWith(normalizedCategory)
  })
})
