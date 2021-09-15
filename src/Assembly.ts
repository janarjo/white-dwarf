import { Attachment, RemoveBehavior } from './components/Attachment'
import { Camera } from './components/Camera'
import { Collision, CollisionGroup } from './components/Collision'
import { Control } from './components/Control'
import { TriggerType as EmitterTriggerType, Emitter } from './components/Emitter'
import { Health } from './components/Health'
import { EntityHub, SlotType } from './components/EntityHub'
import { Movement } from './components/Movement'
import { Render, ShapeType } from './components/Render'
import { Transform } from './components/Transform'
import { Weapon } from './components/Weapon'
import { Directions, scale, Vector } from './Math'
import { TriggerType as EffectTriggerType, EffectHub, EffectType } from './components/EffectHub'
import { degPerSec, pxPerSec, pxPerSec2 } from './Units'

export const camera = () => [
    new Transform({
        position: [0, 0],
        direction: Directions.NORTH,
        lastUpdated: performance.now()
    }),
    new Camera({
        origin: [0, 0],
    }),
    new Attachment({
        type: SlotType.CAMERA,
        onRemove: RemoveBehavior.DETACH,
    }),
]

export const player = (position: Vector) => [
    new Transform({
        position,
        direction: Directions.EAST,
        lastUpdated: performance.now()
    }),
    new Render({
        shape: { type: ShapeType.TRIANGLE, color: 'white', base: 30, height: 50 }
    }),
    new Control({
        isAccelerating: false,
        isDecelerating: false,
        isTurningLeft: false,
        isTurningRight: false,
        isFiring: false,
    }),
    new Movement({
        currDirection: [1, 0],
        currVelocity: [0, 0],
        currAcceleration: [0, 0],
        currRotationalSpeed: 0,
        acceleration: pxPerSec2(200),
        maxSpeed: pxPerSec(300),
        rotationalSpeed: degPerSec(180),
        lastUpdated: performance.now(),
    }),
    new EntityHub({
        slots: [
            { attachmentId: undefined, offset: [0, 0], type: SlotType.CAMERA },
            { attachmentId: undefined, offset: [23, 0], type: SlotType.WEAPON },
        ],
    }),
    new Collision({
        boundingBox: [[-30, -30], [60, 60]],
        isColliding: false,
        group: CollisionGroup.PLAYER,
        mask: [CollisionGroup.ENEMY],
    }),
    new Emitter({
        trigger: EmitterTriggerType.ACCELERATION,
        rateMs: 125,
        decayMs: 0,
        lastEmittedMs: 0,
        offset: [-30, 0],
    })
]

export const projectile = (position: Vector, direction: Vector) => [
    new Transform({
        position,
        direction,
        lastUpdated: performance.now()
    }),
    new Render({
        shape: { type: ShapeType.DOT, color: 'white' }
    }),
    new Movement({
        currVelocity: scale(direction, 300),
        currAcceleration: [0, 0],
        currRotationalSpeed: 0,
        acceleration: pxPerSec2(0),
        maxSpeed: pxPerSec(300),
        rotationalSpeed: degPerSec(0),
        lastUpdated: performance.now(),
    }),
    new Collision({
        isColliding: false,
        boundingBox: [[0, 0], [1, 1]],
        group: CollisionGroup.PLAYER,
        mask: [CollisionGroup.ENEMY],
    }),
    new Health({
        health: 1,
        maxHealth: 1,
        showIndicator: false,
        verticalOffset: 0,
    }),
]

export const asteroid = (position: Vector, direction: Vector) => [
    new Transform({
        position,
        direction,
        lastUpdated: performance.now()
    }),
    new Render({
        shape: { type: ShapeType.CIRCLE, color: 'white', radius: 20 }
    }),
    new Movement({
        currVelocity: scale(direction, 150),
        currAcceleration: [0, 0],
        currRotationalSpeed: 0,
        acceleration: pxPerSec2(0),
        maxSpeed: pxPerSec(150),
        rotationalSpeed: degPerSec(0),
        lastUpdated: performance.now(),
    }),
    new Collision({
        isColliding: false,
        boundingBox: [[-20, -20], [40, 40]],
        group: CollisionGroup.ENEMY,
        mask: [CollisionGroup.PLAYER],
    }),
    new Health({
        health: 100,
        maxHealth: 100,
        showIndicator: true,
        verticalOffset: -30,
    }),
]

export const blaster = () => [
    new Transform({
        position: [0, 0],
        direction: Directions.NORTH,
        lastUpdated: performance.now()
    }),
    new Render({
        shape: { type: ShapeType.DOT, color: 'white' }
    }),
    new Weapon({
        lastFiredMs: 0,
        cooldownMs: 500,
        offset: [0, 0],
    }),
    new Attachment({
        type: SlotType.WEAPON,
        onRemove: RemoveBehavior.DISCARD,
    }),
]

export const exhaust = (position: Vector, direction: Vector) => [
    new Transform({
        position,
        direction,
        lastUpdated: performance.now()
    }),
    new Movement({
        currVelocity: scale(direction, 1.5),
        currAcceleration: [0, 0],
        currRotationalSpeed: 0,
        acceleration: pxPerSec2(0),
        maxSpeed: pxPerSec(0),
        rotationalSpeed: degPerSec(0),
        lastUpdated: performance.now(),
    }),
    new Render({
        shape: { type: ShapeType.TRIANGLE, color: 'white', base: 6, height: 10 },
        effect: { durationMs: 275, startedMs: performance.now() }
    }),
    new EffectHub({
        effects: [{ type: EffectType.DEATH, durationMs: 250, startedMs: performance.now(), trigger: EffectTriggerType.END }]
    })
]
