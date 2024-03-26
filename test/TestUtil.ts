import { Collision } from '../src/components/Collision'
import { Transform } from '../src/components/Transform'

export const transform = (position: [number, number]) => new Transform({ position, direction: [0, 0] })
export const collision = (isColliding: boolean, colliders: number[] = []) =>
    new Collision({ isColliding, colliders, boundingBox: [[0, 0], [0, 0]], group: 0, mask: []})
