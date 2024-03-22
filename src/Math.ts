export type Vector = Readonly<[number, number]>
export type Position = Vector
export type Offset = Vector
export type Dimensions = Vector
export type Range = Vector
export type Projection = Vector
export type Line = Readonly<[Position, Position]>
export type Rectangle = Readonly<[Position, Dimensions]>

// Counter-clockwise order is assumed
export type Polygon = ReadonlyArray<Position>
export type Triangle = Readonly<[Position, Position, Position]>

export const equals = (v1: Vector, v2: Vector) => v1[0] === v2[0] && v1[1] === v2[1]
export const equalsLines = (l1: Line, l2: Line) => equals(l1[0], l2[0]) && equals(l1[1], l2[1])
export const equalsPolygons = (p1: Polygon, p2: Polygon) => p1.length === p2.length && p1.every((p, i) => equals(p, p2[i]))
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
export const translate = (polygon: Polygon, offset: Offset) => polygon.map(p => add(p, offset)) as Polygon
export const overlap = (r1: Range, r2: Range) => Math.min(r1[1], r2[1]) - Math.max(r1[0], r2[0]) > 0
export const union = (set1: Set<number>, set2: Set<number>) => new Set([...set1, ...set2])
export const intersect = (set1: Set<number>, set2: Set<number>) => new Set([...set1].filter(x => set2.has(x)))
export const difference = (set1: Set<number>, set2: Set<number>) => new Set([...set1].filter(x => !set2.has(x)))

export const round = (n: number, precision = 0) => {
    const factor = Math.pow(10, precision)
    return Math.round(n * factor) / factor
}

export type Direction = Vector
export class Directions {
    static readonly EAST = [1, 0] as const
    static readonly SOUTH = [0, 1] as const
    static readonly WEST = [-1, 0] as const
    static readonly NORTH = [0, -1] as const
}

export const rotatePolygon = (points: Polygon, direction: Direction, origin: Position = [0, 0]) => {
    const angle = rad(direction)
    const cosMult = Math.cos(angle)
    const sinMult = Math.sin(angle)

    return points
        .map(v => subtract(v, origin))
        .map(v => [v[0] * cosMult - v[1] * sinMult, v[0] * sinMult + v[1] * cosMult] as const)
        .map(v => add(v, origin)) as Polygon
}
export const rotate = (point: Position, direction: Direction, origin: Position = [0, 0]) => rotatePolygon([point], direction, origin)[0]

export const rand = (min = 0, max = 1) => Math.random() * (max - min) + min
export const randInt = (r: Range) => {
    const min = Math.ceil(r[0])
    const max = Math.floor(r[1])

    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const isWithinRectangle = (v: Position, r: Rectangle) => {
    const [rPos, rDim] = r

    return v[0] >= rPos[0]
        && v[1] >= rPos[1]
        && v[0] <= rDim[0]
        && v[1] <= rDim[1]
}

export const isWithinTriangle = (v: Position, r: Triangle) => {
    const [v1, v2, v3] = r
    const b1 = cross(subtract(v, v1), subtract(v2, v1)) <= 0
    const b2 = cross(subtract(v, v2), subtract(v3, v2)) <= 0
    const b3 = cross(subtract(v, v3), subtract(v1, v3)) <= 0

    return (b1 === b2 && b2 === b3)
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
    if (equalsLines(l1, l2)) return true
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

export const earclip = (polygon: Polygon) => {
    const points = [...polygon]
    if (points.length< 3) throw new Error('Polygon must have at least 3 points!')

    const triangles = new Array<Triangle>()
    let i = 0
    while (points.length > 3) {
        const triangle = [points[i], points[(i + 1) % points.length], points[(i + 2) % points.length]] as const
        if (isEar(triangle, points)) {
            triangles.push(triangle)
            points.splice((i + 1) % points.length, 1)
            i = 0
        } else i++
    }

    triangles.push([points[0], points[1], points[2]] as const)
    return triangles
}

export const isEar = (triangle: Triangle, polygon: Polygon) => {
    const [p1, p2, p3] = triangle

    // Check if the triangle is convex
    if (cross(subtract(p2, p1), subtract(p3, p2)) <= 0) return false

    // Check if any point of the polygon lies inside the triangle
    for (const point of polygon) {
        if (equals(point, p1) || equals(point, p2) || equals(point, p3)) continue
        if (isWithinTriangle(point, triangle)) return false
    }

    return true
}

export const getAxes = (polygon: Polygon) => {
    const axes = new Array<Vector>()
    const numPoints = polygon.length

    for (let i = 0; i < numPoints; i++) {
        const p1 = polygon[i]
        const p2 = polygon[(i + 1) % numPoints]
        const edge = subtract(p2, p1)
        const normal = norm([-edge[1], edge[0]])

        // Check if the normal is parallel to any of the previously added ones
        if (axes.every(axis => Math.abs(dot(normal, axis)) < 1 - 1e-6)) {
            axes.push(normal)
        }
    }

    return axes
}

export const project = (polygon: Polygon, axis: Vector) => {
    const numPoints = polygon.length
    let min = dot(polygon[0], axis)
    let max = min

    for (let i = 1; i < numPoints; i++) {
        const p = dot(polygon[i], axis)
        if (p < min) min = p
        else if (p > max) max = p
    }

    return [min, max] as Range
}
