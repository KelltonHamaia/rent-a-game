import { CustomerRepository } from '@/modules/customers/application/ports/repository/customer.repository.js'
import {
  NewCustomer,
  normalizeNewCustomer,
} from '@/modules/customers/domain/entities/customer.entity.js'
import { CUSTOMER_ERRORS } from '@/modules/customers/domain/errors/customer-errors.js'
import { Either } from '@/modules/shared/errors/Either.js'

export const createCustomerUsecase = (
  customerRepository: CustomerRepository,
) => {
  return async (newCustomer: NewCustomer) => {
    const normalizedCustomer = normalizeNewCustomer(newCustomer)

    const [isCPFInUse, isEmailInUse] = await Promise.all([
      customerRepository.findByCPF(normalizedCustomer.cpf),
      customerRepository.findByEmail(normalizedCustomer.email),
    ])

    if (isCPFInUse) {
      return Either.Left(CUSTOMER_ERRORS.CPF_ALREADY_IN_USE)
    }

    if (isEmailInUse) {
      return Either.Left(CUSTOMER_ERRORS.EMAIL_ALREADY_IN_USE)
    }

    const result = await customerRepository.create(normalizedCustomer)
    return Either.Right(result)
  }
}
