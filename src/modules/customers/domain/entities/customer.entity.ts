export type NewCustomer = {
  name: string
  email: string
  cpf: string
}

export type Customer = NewCustomer & { id: string }

export const normalizeNewCustomer = (newCustomer: NewCustomer): NewCustomer => {
  return {
    name: newCustomer.name.trim(),
    email: newCustomer.email.trim().toLowerCase(),
    cpf: newCustomer.cpf.replace(/\D/g, ''),
  }
}
