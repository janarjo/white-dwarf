import { Offset, Vector, add, scale } from '../math/Math'
import { SoundCode } from '../SoundManager'
import { pxPerSec2, COSMIC_SPEED_LIMIT, degPerSec } from '../Units'
import { Collision, CollisionGroup } from '../components/Collision'
import { Entity } from '../components/Component'
import { Emitter, EmissionType, TriggerType } from '../components/Emitter'
import { Health } from '../components/Health'
import { Physics } from '../components/Physics'
import { Render } from '../components/Render'
import { Transform, ShapeType } from '../components/Transform'
import { metallicGray, plasmaBlue } from '../ui/Colors'
import { EffectCode } from './Effects'
import { earclip } from '../math/SAT'

export const plasmaBullet = (
        position: Vector,
        direction: Vector,
        parentVelocity: Vector,
        isEnemy: boolean) => [
    new Transform({
        position,
        direction,
        shape: { type: ShapeType.CIRCLE, radius: 2 }
    }),
    new Render({
        color: plasmaBlue
    }),
    new Physics({
        currVelocity: add(scale(direction, 300), parentVelocity),
        currAcceleration: [0, 0],
        currRotationalSpeed: 0,
        acceleration: pxPerSec2(0),
        maxVelocity: COSMIC_SPEED_LIMIT,
        rotationalSpeed: degPerSec(0),
        mass: 0.01,
    }),
    new Collision({
        boundingBox: [[0, 0], [1, 1]],
        isColliding: false,
        collisions: [],
        group: isEnemy ? CollisionGroup.ENEMY : CollisionGroup.PLAYER,
        mask: [isEnemy ? CollisionGroup.PLAYER : CollisionGroup.ENEMY],
    }),
    new Health({
        health: 1,
        maxHealth: 1,
        showIndicator: false,
        verticalOffset: 0,
        deathSound: SoundCode.HIT
    }),
]

export const missile = (
        position: Vector,
        direction: Vector,
        parentVelocity: Vector,
        isEnemy: boolean) => {
    const shapePoints: Offset[] = [[-4, -2], [4, 0], [-4, 2]]
    return [
        new Transform({
            position,
            direction,
            shape: { type: ShapeType.POLYGON, points: shapePoints, triangles: earclip(shapePoints) }
        }),
        new Render({
            color: metallicGray
        }),
        new Physics({
            currVelocity: add(scale(direction, 200), parentVelocity),
            currAcceleration: scale(direction, 50),
            currRotationalSpeed: 0,
            acceleration: pxPerSec2(0),
            maxVelocity: COSMIC_SPEED_LIMIT,
            rotationalSpeed: degPerSec(0),
            mass: 1,
        }),
        new Collision({
            boundingBox: [[-6, -6], [12, 12]],
            isColliding: false,
            collisions: [],
            group: isEnemy ? CollisionGroup.ENEMY : CollisionGroup.PLAYER,
            mask: [isEnemy ? CollisionGroup.PLAYER : CollisionGroup.ENEMY],
        }),
        new Health({
            health: 1,
            maxHealth: 1,
            showIndicator: false,
            verticalOffset: 0,
            deathEmitRef: EffectCode.FIRE_EXPLOSION,
            deathSound: SoundCode.EXPLOSION
        }),
        new Emitter({
            emissions: [{
                type: EmissionType.REACTIVE,
                trigger: TriggerType.ACCELERATION,
                emitRef: EffectCode.EXHAUST,
                rateMs: 75,
                decayMs: 0,
                lastEmittedMs: 0,
                offset: [-4, 0],
                size: 0.5,
            }]
        })
    ]
}

export enum ProjectileCode {
    PLASMA_BULLET = 'PLASMA_BULLET',
    MISSILE = 'MISSILE',
}
export type ProjectileFunction = (position: Vector, direction: Vector, parentVelocity: Vector, isEnemy: boolean) => Entity
export const Projectiles: Record<ProjectileCode, ProjectileFunction> = {
    [ProjectileCode.PLASMA_BULLET]: plasmaBullet,
    [ProjectileCode.MISSILE]: missile,
}
