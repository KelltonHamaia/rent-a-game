import { CustomerRepository } from '@/modules/customers/application/ports/repository/customer.repository.js'
import {
  NewCustomer,
  normalizeNewCustomer,
} from '@/modules/customers/domain/entities/customer.entity.js'

export const createCustomerUsecase = (
  customerRepository: CustomerRepository,
) => {
  return async (newCustomer: NewCustomer) => {
    const normalizedCustomer = normalizeNewCustomer(newCustomer)
    const result = await customerRepository.create(normalizedCustomer)

    return result
  }
}
