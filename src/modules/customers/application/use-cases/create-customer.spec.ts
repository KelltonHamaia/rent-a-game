import type { CustomerRepository } from '@/modules/customers/application/ports/repository/customer.repository.js'
import { createCustomerUsecase } from '@/modules/customers/application/use-cases/create-customer.usecase.js'
import type {
  Customer,
  NewCustomer,
} from '@/modules/customers/domain/entities/customer.entity.js'
import { CUSTOMER_ERRORS } from '@/modules/customers/domain/errors/customer-errors.js'
import { describe, expect, it, vi } from 'vitest'

describe('Create customer usecase', () => {
  const makeSut = () => {
    const customerRepository = {
      create: vi.fn<CustomerRepository['create']>(),
      findByCPF: vi.fn<CustomerRepository['findByCPF']>().mockResolvedValue(null),
      findByEmail: vi.fn<CustomerRepository['findByEmail']>().mockResolvedValue(null),
    } satisfies CustomerRepository

    const sut = createCustomerUsecase(customerRepository)
    return { customerRepository, sut }
  }

  const unnormalizedCustomer: NewCustomer = {
    name: '  some name',
    email: 'email@Gmail.com ',
    cpf: '123.123.123-12   ',
  }

  const normalizedCustomer: NewCustomer = {
    name: 'some name',
    email: 'email@gmail.com',
    cpf: '12312312312',
  }

  const customer: Customer = {
    id: '01a1c35f-9d8f-751d-9185-88174eb581aa',
    ...normalizedCustomer,
  }

  it('Should normalize and create a customer', async () => {
    const { customerRepository, sut } = makeSut()
    customerRepository.create.mockResolvedValue(customer)

    const output = await sut(unnormalizedCustomer)

    expect(output.right).toEqual({ result: customer })
    expect(output.left).toBeNull()

    expect(customerRepository.findByCPF).toHaveBeenCalledTimes(1)
    expect(customerRepository.findByCPF).toHaveBeenCalledWith(normalizedCustomer.cpf)

    expect(customerRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(customerRepository.findByEmail).toHaveBeenCalledWith(normalizedCustomer.email)

    expect(customerRepository.create).toHaveBeenCalledTimes(1)
    expect(customerRepository.create).toHaveBeenCalledWith(normalizedCustomer)
  })

  it('Should return a Left Either if the CPF is already in use', async () => {
    const { customerRepository, sut } = makeSut()
    customerRepository.findByCPF.mockResolvedValue(customer)

    const output = await sut(normalizedCustomer)

    expect(output.right).toBeNull()
    expect(output.left).toEqual(CUSTOMER_ERRORS.CPF_ALREADY_IN_USE)

    expect(customerRepository.findByCPF).toHaveBeenCalledTimes(1)
    expect(customerRepository.findByCPF).toHaveBeenCalledWith(normalizedCustomer.cpf)

    expect(customerRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(customerRepository.findByEmail).toHaveBeenCalledWith(normalizedCustomer.email)

    expect(customerRepository.create).not.toHaveBeenCalled()
  })

  it('Should return a Left Either if the EMAIL is already in use', async () => {
    const { customerRepository, sut } = makeSut()
    customerRepository.findByEmail.mockResolvedValue(customer)

    const output = await sut(normalizedCustomer)

    expect(output.right).toBeNull()
    expect(output.left).toEqual(CUSTOMER_ERRORS.EMAIL_ALREADY_IN_USE)

    expect(customerRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(customerRepository.findByEmail).toHaveBeenCalledWith(normalizedCustomer.email)

    expect(customerRepository.findByCPF).toHaveBeenCalledTimes(1)
    expect(customerRepository.findByCPF).toHaveBeenCalledWith(normalizedCustomer.cpf)

    expect(customerRepository.create).not.toHaveBeenCalled()
  })
})
