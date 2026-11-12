import type { CustomerRepository } from '@/modules/customers/application/ports/repository/customer.repository.js'
import { createCustomerUsecase } from '@/modules/customers/application/use-cases/create-customer.usecase.js'
import type { Customer } from '@/modules/customers/domain/entities/customer.entity.js'
import { CUSTOMER_ERRORS } from '@/modules/customers/domain/errors/customer-errors.js'
import { beforeEach } from 'node:test'
import { describe, expect, test, vi } from 'vitest'

describe('Create customer usecase', () => {
  const customerRepository = {
    create: vi.fn<CustomerRepository['create']>(),
    findByCPF: vi.fn<CustomerRepository['findByCPF']>(),
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('Should normalize and create a customer', async () => {
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
    customerRepository.findByCPF.mockResolvedValue(null)
    customerRepository.create.mockResolvedValue(savedCustomer)

    const sut = createCustomerUsecase(customerRepository)
    const output = await sut(rawCustomer)

    expect(customerRepository.findByCPF).toHaveBeenCalledWith(
      normalizedCustomer.cpf,
    )
    expect(customerRepository.create).toHaveBeenCalledTimes(1)

    expect(customerRepository.create).toHaveBeenCalledWith(normalizedCustomer)
    expect(customerRepository.create).toHaveBeenCalledTimes(1)
    expect(output.right).toEqual({ result: savedCustomer })
  })

  test('Shoud return a Left Either if the CPF is already in use', async () => {
    const invalidCPFCustomerDTO = {
      name: 'Teste nome',
      email: 'teste@gmail.com',
      cpf: '12345678909',
    }
    const sut = createCustomerUsecase(customerRepository)
    customerRepository.findByCPF.mockResolvedValue({
      ...invalidCPFCustomerDTO,
      id: '01a1c35f-9d8f-751d-9185-88174eb581aa',
    })
    const output = await sut(invalidCPFCustomerDTO)

    expect(output.right).toBeNull()
    expect(output.left).toEqual(CUSTOMER_ERRORS.CPF_ALREADY_IN_USE)
    expect(customerRepository.findByCPF).toHaveBeenCalledWith(
      invalidCPFCustomerDTO.cpf,
    )
    expect(customerRepository.findByCPF).toHaveBeenCalledTimes(1)
    expect(customerRepository.create).not.toHaveBeenCalled()
  })
})
