import { Vector, Offset, scale, earclip } from '../Math'
import { pxPerSec2, pxPerSec, degPerSec } from '../Units'
import { EffectHub, EffectType, TriggerType } from '../components/EffectHub'
import { Physics } from '../components/Physics'
import { Render, EffectCode, AnimationCode } from '../components/Render'
import { Transform, ShapeType } from '../components/Transform'
import { fireOrange } from '../ui/Colors'

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
            lastUpdated: performance.now(),
            mass: 0.1,
        }),
        new Render({
            color: fireOrange,
            effect: { code: EffectCode.FADE, durationMs: 275, startedMs: performance.now() }
        }),
        new EffectHub({
            effects: [{ type: EffectType.DEATH, durationMs: 250, startedMs: performance.now(), trigger: TriggerType.END }]
        })
    ]
}

export const explosion = (position: Vector, radius: number) => {
    return [
        new Transform({
            position,
            direction: [0, 0],
        }),
        new Render({
            color: fireOrange,
            effect: { code: EffectCode.FADE, durationMs: 250, startedMs: performance.now() },
            animation: { code: AnimationCode.EXPLOSION, radius, durationMs: 250, startedMs: performance.now() }
        }),
        new EffectHub({
            effects: [{ type: EffectType.DEATH, durationMs: 250, startedMs: performance.now(), trigger: TriggerType.END }]
        })
    ]
}
