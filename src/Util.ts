export function isDefined<T>(value: T | undefined): value is T {
    return value !== undefined
}

export function isUndefined<T>(value: T | undefined): value is undefined {
    return value === undefined
}

export function isEmpty<T>(value: T[] | Set<T> | undefined): value is T[] | Set<T> | undefined {
    return value === undefined
    || value instanceof Array && value.length === 0
    || value instanceof Set && value.size === 0
}

export function isNotEmpty<T>(value: T[] | undefined): value is T[] {
    return value !== undefined && value.length > 0
}

export function isNotEmptySet<T>(value: Set<T> | undefined): value is Set<T> {
    return value !== undefined && value.size > 0
}
