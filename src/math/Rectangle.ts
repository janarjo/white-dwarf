import { Vector } from './Vector';

export type Rectangle = Readonly<[Vector, number, number]>
export const isIntersect = (r1: Rectangle, r2: Rectangle) => {
    const [[r1X, r1Y], r1Width, r1Height] = r1
    const [[r2X, r2Y], r2Width, r2Height] = r2

    return r1X + r1Width > r2X
        && r1Y + r1Height > r2Y
        && r2X + r2Width > r1X
        && r2Y + r2Height > r1Y
}
