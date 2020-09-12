export type Vector = Readonly<[number, number]>
export const add = (v1: Vector, v2: Vector) => [v1[0] + v2[0], v1[1] + v2[1]] as const
export const subtract = (v1: Vector, v2: Vector) => [v1[0] - v2[0], v1[1] - v2[1]] as const
export const scale = (v: Vector, n: number) => [v[0] * n, v[1] * n] as const
export const divide = (v: Vector, n: number) => [v[0] / n, v[1] / n] as const

export type Position = Vector
export type Offset = Vector
export type Dimensions = Vector
export type Range = Vector

export const rotatePoints = (origin: Position, angle: number, points: ReadonlyArray<Position>) => {
    const cosMult = Math.cos(angle)
    const sinMult = Math.sin(angle)

    return points
        .map(v => subtract(v, origin))
        .map(v => [v[1] * cosMult - v[0] * sinMult, v[0] * cosMult + v[1] * sinMult] as const)
        .map(v => add(v, origin))
}
export const rotate = (origin: Position, angle: number, point: Position) => rotatePoints(origin, angle, [point])[0]

export const rand = (min = 0, max = 1) => Math.random() * (max - min) + min
export const randInt = (r: Range) => {
    const min = Math.ceil(r[0])
    const max = Math.floor(r[1])

    return Math.floor(Math.random() * (max - min + 1)) + min
}

export type Rectangle = Readonly<[Position, Dimensions]>
export const isWithin = (v: Position, r: Rectangle) => {
    const [rPos, rDim] = r
    
    return v[0] >= rPos[0] 
        && v[1] >= rPos[1]
        && v[0] <= rDim[0] 
        && v[1] <= rDim[1] 
}
export const isIntersect = (r1: Rectangle, r2: Rectangle) => {
    const [[r1X, r1Y], [r1W, r1H]] = r1
    const [[r2X, r2Y], [r2W, r2H]] = r2

    return r1X + r1W > r2X
        && r1Y + r1H > r2Y
        && r2X + r2W > r1X
        && r2Y + r2H > r1Y
}
