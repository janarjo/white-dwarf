import { Vector, Offset, scale } from '../math/Math'
import { pxPerSec2, pxPerSec, degPerSec } from '../Units'
import { Entity } from '../components/Component'
import { ConditionHub, ConditionType, TriggerType } from '../components/ConditionHub'
import { Physics } from '../components/Physics'
import { Render, DrawEffectCode, AnimationCode } from '../components/Render'
import { Transform, ShapeType } from '../components/Transform'
import { asteroidGray, fireOrange } from '../ui/Colors'
import { earclip } from '../math/SAT'

export const exhaust = (position: Vector, direction: Vector, size: number = 1) => {
    const shapePoints: Offset[] = [[-8, -5], [8, 0], [-8, 5]]
    const scaledPoints = shapePoints.map(point => scale(point, size))
    return [
        new Transform({
            position,
            direction,
            shape: { type: ShapeType.POLYGON, points: scaledPoints, triangles: earclip(scaledPoints) },
        }),
        new Physics({
            currVelocity: scale(direction, 1.5),
            currAcceleration: [0, 0],
            currRotationalSpeed: 0,
            acceleration: pxPerSec2(0),
            maxVelocity: pxPerSec(0),
            rotationalSpeed: degPerSec(0),
            mass: 0.1,
        }),
        new Render({
            color: fireOrange,
            drawEffect: { code: DrawEffectCode.FADE, durationMs: 275, startedMs: performance.now() }
        }),
        new ConditionHub({
            conditions: [{ type: ConditionType.DYING, durationMs: 250, startedMs: performance.now(), trigger: TriggerType.END }]
        })
    ]
}

export const fireExplosion = (position: Vector) => {
    return [
        new Transform({ position, direction: [0, 0], shape: { type: ShapeType.CIRCLE, radius: 30 } }),
        new Render({
            color: fireOrange,
            animation: { code: AnimationCode.EXPLOSION, radius: 30, durationMs: 500, startedMs: performance.now() }
        }),
        new ConditionHub({
            conditions: [{ type: ConditionType.DYING, durationMs: 500, startedMs: performance.now(), trigger: TriggerType.END }]
        })
    ]
}

export const dustExplosion = (position: Vector) => {
    return [
        new Transform({ position, direction: [0, 0], shape: { type: ShapeType.CIRCLE, radius: 50 } }),
        new Render({
            color: asteroidGray,
            animation: { code: AnimationCode.EXPLOSION, radius: 50, durationMs: 1000, startedMs: performance.now() }
        }),
        new ConditionHub({
            conditions: [{ type: ConditionType.DYING, durationMs: 1000, startedMs: performance.now(), trigger: TriggerType.END }]
        })
    ]
}

export enum EffectCode {
    EXHAUST = 'EXHAUST',
    FIRE_EXPLOSION = 'FIRE_EXPLOSION',
    DUST_EXPLOSION = 'DUST_EXPLOSION',
}
export type EffectFunction = (position: Vector, direction: Vector, size: number) => Entity
export const Effects: Record<EffectCode, EffectFunction> = {
    [EffectCode.EXHAUST]: exhaust,
    [EffectCode.FIRE_EXPLOSION]: fireExplosion,
    [EffectCode.DUST_EXPLOSION]: dustExplosion,
}
