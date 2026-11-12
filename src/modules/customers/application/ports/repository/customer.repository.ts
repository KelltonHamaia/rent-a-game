import {
  Customer,
  type NewCustomer,
} from '@/modules/customers/domain/entities/customer.entity.js'

export type CustomerRepository = {
  create: (newCustomer: NewCustomer) => Promise<Customer>
  findByCPF: (id: string) => Promise<Customer | null>
}
