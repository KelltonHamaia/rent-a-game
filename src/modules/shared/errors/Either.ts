export type Left = {
  code: string
  message: string
}

type Right<T> = {
  result: T
}

export class Either<T> {
  public readonly left: Left | null
  public readonly right: Right<T> | null

  private constructor(left: Left | null, right: Right<T> | null) {
    this.left = left
    this.right = right
  }

  static Left<T>(error: Left): Either<T> {
    return new Either(error, null)
  }

  static Right<T>(data: T): Either<T> {
    return new Either(null, { result: data })
  }
}
