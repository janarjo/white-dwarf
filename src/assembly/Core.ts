import { smallPlasmaPack, smallMissilePack } from '../Items'
import { Directions, Offset, Vector, earclip } from '../Math'
import { SoundCode } from '../SoundManager'
import { pxPerSec2, pxPerSec, degPerSec, COSMIC_SPEED_LIMIT } from '../Units'
import { Attachment, RemoveBehavior } from '../components/Attachment'
import { Camera } from '../components/Camera'
import { Collision, CollisionGroup } from '../components/Collision'
import { Control } from '../components/Control'
import { Emitter, EmissionType, TriggerType } from '../components/Emitter'
import { EntityHub, SlotType } from '../components/EntityHub'
import { Health } from '../components/Health'
import { Inventory } from '../components/Inventory'
import { Physics } from '../components/Physics'
import { QuickSlot } from '../components/QuickSlot'
import { Render } from '../components/Render'
import { ShapeType, Transform } from '../components/Transform'
import { asteroidGray, metallicGray } from '../ui/Colors'
import { EffectCode } from './Effects'


export const camera = () => [
    new Transform({
        position: [0, 0],
        direction: Directions.NORTH,
    }),
    new Camera({
        origin: [0, 0],
        zoom: 1,
    }),
    new Attachment({
        type: SlotType.CAMERA,
        onRemove: RemoveBehavior.DETACH,
    }),
]

export const player = (position: Vector) => {
    const shapePoints: Offset[] = [[-24, -15], [24, 0], [-24, 15]]
    const primaryWeapon = smallPlasmaPack()
    const secondaryWeapon = smallMissilePack()
    return [
        new Transform({
            position,
            direction: Directions.EAST,
            shape: { type: ShapeType.POLYGON, points: shapePoints, triangles: earclip(shapePoints) },
        }),
        new Render({ color: metallicGray }),
        new Control({
            isAccelerating: false,
            isDecelerating: false,
            isTurningLeft: false,
            isTurningRight: false,
            isFiring: false,
            isBraking: false,
            quickSlotIndex: 0,
            zoomFactor: 1,
        }),
        new Physics({
            currDirection: [1, 0],
            currVelocity: [0, 0],
            currAcceleration: [0, 0],
            currRotationalSpeed: 0,
            acceleration: pxPerSec2(50),
            maxVelocity: pxPerSec(200),
            rotationalSpeed: degPerSec(180),
            lastUpdated: performance.now(),
            mass: 1,
        }),
        new EntityHub({
            slots: [
                { attachmentId: undefined, offset: [0, 0], type: SlotType.CAMERA },
                { attachmentId: undefined, offset: [23, 0], type: SlotType.WEAPON },
                { attachmentId: undefined, offset: [23, 0], type: SlotType.WEAPON },
            ],
        }),
        new Collision({
            boundingBox: [[-30, -30], [60, 60]],
            isColliding: false,
            colliders: [],
            group: CollisionGroup.PLAYER,
            mask: [CollisionGroup.ENEMY],
        }),
        new Emitter({
            emissions: [{
                type: EmissionType.REACTIVE,
                trigger: TriggerType.ACCELERATION,
                emitRef: EffectCode.EXHAUST,
                rateMs: 125,
                decayMs: 0,
                lastEmittedMs: 0,
                offset: [-30, 0],
                size: 1,
                emitSound: SoundCode.THRUST
            }]
        }),
        new Inventory({
            items: [primaryWeapon, secondaryWeapon],
            maxSize: 10
        }),
        new QuickSlot({
            currItem: primaryWeapon,
            items: [primaryWeapon, secondaryWeapon]
        })
    ]
}

export const enemy = (position: Vector) => {
    const shapePoints: Offset[] = [[-24, -15], [24, 0], [-24, 15]]
    return [
        new Transform({
            position,
            direction: Directions.EAST,
            shape: { type: ShapeType.POLYGON, points: shapePoints, triangles: earclip(shapePoints) },
        }),
        new Render({ color: metallicGray }),
        /* new AI({
            isAccelerating: false,
            isDecelerating: false,
            isTurningLeft: false,
            isTurningRight: false,
            isFiring: false,
            isBraking: false,
            pollingRate: ms(500),
            lastPolled: performance.now(),
        }), */
        new Physics({
            currDirection: [1, 0],
            currVelocity: [0, 0],
            currAcceleration: [0, 0],
            currRotationalSpeed: 0,
            acceleration: pxPerSec2(200),
            maxVelocity: pxPerSec(300),
            rotationalSpeed: degPerSec(180),
            lastUpdated: performance.now(),
            mass: 1,
        }),
        new EntityHub({
            slots: [{ attachmentId: undefined, offset: [23, 0], type: SlotType.WEAPON }],
        }),
        new Collision({
            boundingBox: [[-30, -30], [60, 60]],
            isColliding: false,
            colliders: [],
            group: CollisionGroup.ENEMY,
            mask: [CollisionGroup.PLAYER],
        }),
        new Emitter({
            emissions: [{
                type: EmissionType.REACTIVE,
                trigger: TriggerType.ACCELERATION,
                emitRef: EffectCode.EXHAUST,
                rateMs: 125,
                decayMs: 0,
                lastEmittedMs: 0,
                offset: [-30, 0],
                size: 1,
                emitSound: SoundCode.THRUST
            }]
        })
    ]
}

export const asteroid = (position: Vector, direction: Vector, points: Offset[], velocity: Vector) => [
    new Transform({
        position,
        direction,
        shape: { type: ShapeType.POLYGON, points, triangles: earclip(points) }
    }),
    new Render({ color: asteroidGray }),
    new Physics({
        currVelocity: velocity,
        currAcceleration: [0, 0],
        currRotationalSpeed: 0,
        acceleration: pxPerSec2(0),
        maxVelocity: COSMIC_SPEED_LIMIT,
        rotationalSpeed: degPerSec(0),
        lastUpdated: performance.now(),
        mass: 1.5,
    }),
    new Collision({
        boundingBox: [[-30, -30], [60, 60]],
        isColliding: false,
        colliders: [],
        group: CollisionGroup.ENEMY,
        mask: [CollisionGroup.PLAYER, CollisionGroup.ENEMY],
    }),
    new Health({
        health: 100,
        maxHealth: 100,
        showIndicator: true,
        verticalOffset: -30,
    }),
]
