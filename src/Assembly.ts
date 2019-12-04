import { Collision } from './components/Collision'
import { Control } from './components/Control'
import { Health } from './components/Health'
import { Movement } from './components/Movement'
import { Render } from './components/Render'
import { Transform } from './components/Transform'
import { Weapon } from './components/Weapon'
import { Vector } from './Math'
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
        rotationalSpeed: 0.075,
    }),
    new Weapon({
        lastFired: 0,
        cooldown: 500,
        offset: [0, 23],
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
        currSpeed: 5,
        currAcceleration: 0,
        currRotationalSpeed: 0,
        acceleration: 0,
        maxSpeed: 5,
        rotationalSpeed: 0,
    }),
    new Collision({
        isColliding: false,
        boundingBox: [[0, 0], [1, 1]],
    }),
    new Health({
        health: 1,
        maxHealth: 1,
    }),
]

export const planetoid = (position: Vector, orientation: number) => [
    new Transform({
        position,
        orientation,
    }),
    new Render({
        type: ShapeType.CIRCLE,
    }),
    new Movement({
        currSpeed: 1.5,
        currAcceleration: 0,
        currRotationalSpeed: 0,
        acceleration: 0,
        maxSpeed: 1.5,
        rotationalSpeed: 0,
    }),
    new Collision({
        isColliding: false,
        boundingBox: [[-20, -20], [40, 40]],
    }),
    new Health({
        health: 100,
        maxHealth: 100,
    }),
]
