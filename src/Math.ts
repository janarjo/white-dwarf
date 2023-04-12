export type Vector = Readonly<[number, number]>
export type Position = Vector
export type Offset = Vector
export type Dimensions = Vector
export type Range = Vector
export type Line = Readonly<[Position, Position]>

export const add = (v1: Vector, v2: Vector) => [v1[0] + v2[0], v1[1] + v2[1]] as const
export const subtract = (v1: Vector, v2: Vector) => [v1[0] - v2[0], v1[1] - v2[1]] as const
export const scale = (v: Vector, n: number) => [v[0] * n, v[1] * n] as const
export const divide = (v: Vector, n: number) => [v[0] / n, v[1] / n] as const
export const cross = (v1: Vector, v2: Vector) => v1[0] * v2[1] - v1[1] * v2[0]
export const dot = (v1: Vector, v2: Vector) => v1[0] * v2[0] + v1[1] * v2[1]
export const det = (v1: Vector, v2: Vector) => v1[0] * v2[1] - v1[1] * v2[0]
export const neg = (v: Vector) => scale(v, -1)
export const mag = (v: Vector) => Math.sqrt(v[0] * v[0] + v[1] * v[1])
export const norm = (v: Vector) => divide(v, mag(v))
export const rad = (v: Vector) => Math.atan2(v[1], v[0])
export const angleBetween = (v1: Vector, v2: Vector) => rad([dot(v1, v2), det(v1, v2)])
export const hvec = (rad: number) => [Math.cos(rad), Math.sin(rad)] as const
export const limit = (v: Vector, max: number) => {
    const magnitude = mag(v)
    return magnitude > max ? scale(divide(v, magnitude), max) : v
}

export type Direction = Vector
export class Directions {
    static readonly EAST = [1, 0] as const
    static readonly SOUTH = [0, 1] as const
    static readonly WEST = [-1, 0] as const
    static readonly NORTH = [0, -1] as const
}

export const rotatePoints = (points: Position[], direction: Direction, origin: Position = [0, 0]) => {
    const angle = rad(direction)
    const cosMult = Math.cos(angle)
    const sinMult = Math.sin(angle)
    
    return points
        .map(v => subtract(v, origin))
        .map(v => [v[0] * cosMult - v[1] * sinMult, v[0] * sinMult + v[1] * cosMult] as const)
        .map(v => add(v, origin))
}
export const rotate = (point: Position, direction: Direction, origin: Position = [0, 0]) => rotatePoints([point], direction, origin)[0]

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

    return r1X + r1W >= r2X
        && r1Y + r1H >= r2Y
        && r2X + r2W >= r1X
        && r2Y + r2H >= r1Y
}

export const isIntersectingLineSegments = (l1: Line, l2: Line) => {
    if (l1 === l2) return true
    const [p1, p2] = l1
    const [p3, p4] = l2

    const d1 = cross(subtract(p2, p1), subtract(p3, p1))
    const d2 = cross(subtract(p2, p1), subtract(p4, p1))
    const d3 = cross(subtract(p4, p3), subtract(p1, p3))
    const d4 = cross(subtract(p4, p3), subtract(p2, p3))

    return (d1 > 0 && d2 < 0 || d1 < 0 && d2 > 0) && (d3 > 0 && d4 < 0 || d3 < 0 && d4 > 0)
}

export const isPolygon = (points: Offset[]) => {
    const numPoints = points.length
    if (numPoints < 3) return false

    for (let i = 0; i < numPoints; i++) {
        const l1 = [points[i], points[(i + 1) % numPoints]] as const
        for (let j = i + 2; j < numPoints; j++) {
            const l2 = [points[j], points[(j + 1) % numPoints]]  as const
            if (isIntersectingLineSegments(l1, l2)) return false
        }
    }

    return true
}

export const generateRandomPolygon = (numPoints: number, minRadius: number, maxRadius: number) => {
    const points = new Array<Offset>(numPoints)
    const angle = 2 * Math.PI / numPoints

    for (let i = 0; i < numPoints; i++) {
        const radius = rand(minRadius, maxRadius)
        const point = scale(hvec(angle * i), radius)
        points[i] = point
    }

    return points
}
