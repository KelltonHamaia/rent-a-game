import type { CustomerRepository } from '@/modules/customers/application/ports/repository/customer.repository.js'
import { createCustomerUsecase } from '@/modules/customers/application/use-cases/create-customer.usecase.js'
import type { Customer } from '@/modules/customers/domain/entities/customer.entity.js'
import { describe, expect, test, vi } from 'vitest'

describe('Create customer usecase', () => {
  test('Should normalize and create a customer', async () => {
    const customerRepository = {
      create: vi.fn<CustomerRepository['create']>(),
    }

    const rawCustomer = {
      name: '  Teste nome ',
      email: ' teste@Gmail.com ',
      cpf: '123.456.789-09',
    }

    const normalizedCustomer = {
      name: 'Teste nome',
      email: 'teste@gmail.com',
      cpf: '12345678909',
    }

    const savedCustomer: Customer = {
      ...normalizedCustomer,
      id: '01a1c35f-9d8f-751d-9185-88174eb581aa',
    }
    customerRepository.create.mockResolvedValue(savedCustomer)

    const sut = createCustomerUsecase(customerRepository)
    const output = await sut(rawCustomer)

    expect(customerRepository.create).toHaveBeenCalledWith(normalizedCustomer)
    expect(customerRepository.create).toHaveBeenCalledTimes(1)
    expect(output).toEqual(savedCustomer)
  })
})
