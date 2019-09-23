import { Collision } from './components/Collision'
import { Control } from './components/Control'
import { Movement } from './components/Movement'
import { Render } from './components/Render'
import { Transform } from './components/Transform'
import { Weapon } from './components/Weapon'
import { add, Vector } from './math/Vector'
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
        cooldown: 1000,
    }),
    new Collision({
        isColliding: false,
        boundingBox: [add(position, [-28, -28]), 56, 56],
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
        currSpeed: 7,
        currAcceleration: 0,
        currRotationalSpeed: 0,
        acceleration: 0,
        maxSpeed: 7,
        rotationalSpeed: 0,
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
        boundingBox: [add(position, [-28, -28]), 56, 56],
    }),
]
