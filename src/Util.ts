export function isDefined<T>(value: T | undefined): value is T {
    return value !== undefined
}

export function isUndefined<T>(value: T | undefined): value is undefined {
    return value === undefined
}
