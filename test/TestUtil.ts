import { COSMIC_SPEED_LIMIT, degPerSec, pxPerSec2 } from '../src/Units'
import { Collision } from '../src/components/Collision'
import { Physics } from '../src/components/Physics'
import { Transform } from '../src/components/Transform'

export const transform = (position: [number, number]) => new Transform({ position, direction: [0, 0] })
export const collision = (isColliding: boolean, colliders: number[] = []) =>
    new Collision({ isColliding, colliders, boundingBox: [[0, 0], [0, 0]], group: 0, mask: []})
export const physics = (currVelocity: [number, number], mass: number = 1) => new Physics({
    currVelocity,
    currRotationalSpeed: 0,
    currAcceleration: [0, 0],
    acceleration: pxPerSec2(10),
    rotationalSpeed: degPerSec(10),
    maxVelocity: COSMIC_SPEED_LIMIT,
    mass
})
