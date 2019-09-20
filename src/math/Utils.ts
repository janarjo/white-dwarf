import { add, subtract, Vector } from './Vector'

export function rotate(origin: Vector, angle: number, points: ReadonlyArray<Vector>): ReadonlyArray<Vector> {
    const cosMult = Math.cos(angle)
    const sinMult = Math.sin(angle)

    return points
        .map(v => subtract(v, origin))
        .map(v => [v[1] * cosMult - v[0] * sinMult, v[0] * cosMult + v[1] * sinMult] as const)
        .map(v => add(v, origin))
}
