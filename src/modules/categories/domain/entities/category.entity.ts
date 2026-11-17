export type NewCategory = {
  name: string
}

export type Category = NewCategory & { id: string }

export const normalizeCategory = (newCategory: NewCategory): NewCategory => {
  return {
    name: newCategory.name.toUpperCase(),
  }
}
