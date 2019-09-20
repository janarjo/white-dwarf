export type Vector = Readonly<[number, number]>
export const add = (v1: Vector, v2: Vector) => [v1[0] + v2[0], v1[1] + v2[1]] as const
export const subtract = (v1: Vector, v2: Vector) => [v1[0] - v2[0], v1[1] - v2[1]] as const
export const scale = (v: Vector, n: number) => [v[0] * n, v[1] * n] as const
export const isWithin = (v: Vector, area: Vector) => v[0] >= 0 && v[0] <= area[0] && v[1] >= 0 && v[1] <= area[1]
