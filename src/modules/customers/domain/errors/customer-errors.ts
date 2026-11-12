import { type Left } from '@/modules/shared/errors/Either.js'

export const CUSTOMER_ERRORS = {
  CPF_ALREADY_IN_USE: {
    code: 'CPF_ALREADY_IN_USE',
    message: 'CPF already in use.',
  },
} satisfies Record<string, Left>
