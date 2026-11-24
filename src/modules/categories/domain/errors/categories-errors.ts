import { type Left } from '@/modules/shared/errors/Either.js'

export const CATEGORIES_ERRORS = {
  CATEGORY_ALREADY_EXISTS: {
    code: 'CATEGORY_ALREADY_EXISTS',
    message: 'CATEGORY already exists.',
  },
} satisfies Record<string, Left>
