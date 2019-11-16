import { Collision } from './components/Collision'
import { Control } from './components/Control'
import { Movement } from './components/Movement'
import { Render } from './components/Render'
import { Transform } from './components/Transform'
import { Weapon } from './components/Weapon'
import { add, Vector } from './Math'
import { ShapeType } from './ui/Shape'

export const player = (position: Vector) => [
    new Transform({
        position,
        orientation: 0,
    }),
    new Render({
        type: ShapeType.TRIANGLE,
    }),
    new Control({
        isAccelerating: false,
        isDecelerating: false,
        isTurningLeft: false,
        isTurningRight: false,
        isFiring: false,
    }),
    new Movement({
        currSpeed: 0,
        currAcceleration: 0,
        currRotationalSpeed: 0,
        acceleration: 0.1,
        maxSpeed: 5,
        rotationalSpeed: 0.1,
    }),
    new Weapon({
        lastFired: 0,
        cooldown: 500,
    }),
]

export const projectile = (position: Vector, orientation: number) => [
    new Transform({
        position,
        orientation,
    }),
    new Render({
        type: ShapeType.DOT,
    }),
    new Movement({
        currSpeed: 2,
        currAcceleration: 0,
        currRotationalSpeed: 0,
        acceleration: 0,
        maxSpeed: 2,
        rotationalSpeed: 0,
    }),
    new Collision({
        isColliding: false,
        boundingBox: [[0, 0], [1, 1]],
    }),
]

export const planetoid = (position: Vector) => [
    new Transform({
        position,
        orientation: 0,
    }),
    new Render({
        type: ShapeType.CIRCLE,
    }),
    new Collision({
        isColliding: false,
        boundingBox: [[-20, -20], [40, 40]],
    }),
]
