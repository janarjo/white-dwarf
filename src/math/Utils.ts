import { Vector } from '../math/Vector';

export function rotate(origin: Vector, angle: number, points: ReadonlyArray<Vector>): ReadonlyArray<Vector> {
    const cosMult = Math.cos(angle);
    const sinMult = Math.sin(angle);

    return points
        .map((v) => v.subtract(origin))
        .map((v) => new Vector(v.y * cosMult - v.x * sinMult, v.x * cosMult + v.y * sinMult))
        .map((v) => v.add(origin));
}
