import { Attachment, RemoveBehavior } from './components/Attachment'
import { Camera } from './components/Camera'
import { Collision, CollisionGroup } from './components/Collision'
import { Control } from './components/Control'
import { TriggerType as EmitterTriggerType, Emitter } from './components/Emitter'
import { Health } from './components/Health'
import { EntityHub, SlotType } from './components/EntityHub'
import { Physics as Physics } from './components/Physics'
import { EffectCode, Render } from './components/Render'
import { ShapeType, Transform } from './components/Transform'
import { Weapon } from './components/Weapon'
import { add, Directions, earclip, Offset, scale, Vector } from './Math'
import { TriggerType as EffectTriggerType, EffectHub, EffectType } from './components/EffectHub'
import { COSMIC_SPEED_LIMIT, degPerSec, pxPerSec, pxPerSec2 } from './Units'
import { Inventory } from './components/Inventory'
import { ItemCode, smallMissilePack, smallPlasmaPack } from './Items'
import { QuickSlot } from './components/QuickSlot'
import { asteroidGray, boosterOrange, metallicGray, plasmaBlue, white } from './ui/Colors'
import { SoundCode } from './SoundManager'

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
            trigger: EmitterTriggerType.ACCELERATION,
            rateMs: 125,
            decayMs: 0,
            lastEmittedMs: 0,
            offset: [-30, 0],
            size: 1,
            emitSound: SoundCode.THRUST
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
        new Render({color: metallicGray }),
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
            trigger: EmitterTriggerType.ACCELERATION,
            rateMs: 125,
            decayMs: 0,
            lastEmittedMs: 0,
            offset: [-30, 0],
            size: 1,
        })
    ]
}

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
        lastUpdated: performance.now(),
        mass: 0.01,
    }),
    new Collision({
        boundingBox: [[0, 0], [1, 1]],
        isColliding: false,
        colliders: [],
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
            shape: { type: ShapeType.POLYGON, points: shapePoints, triangles: earclip(shapePoints)}
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
            lastUpdated: performance.now(),
            mass: 1,
        }),
        new Collision({
            boundingBox: [[-6, -6], [12, 12]],
            isColliding: false,
            colliders: [],
            group: isEnemy ? CollisionGroup.ENEMY : CollisionGroup.PLAYER,
            mask: [isEnemy ? CollisionGroup.PLAYER : CollisionGroup.ENEMY],
        }),
        new Health({
            health: 1,
            maxHealth: 1,
            showIndicator: false,
            verticalOffset: 0,
            deathSound: SoundCode.EXPLOSION
        }),
        new Emitter({
            trigger: EmitterTriggerType.ACCELERATION,
            rateMs: 75,
            decayMs: 0,
            lastEmittedMs: 0,
            offset: [-4, 0],
            size: 0.5,
        })
    ]}

export const asteroid = (position: Vector, direction: Vector, points: Offset[]) => [
    new Transform({
        position,
        direction,
        shape: { type: ShapeType.POLYGON, points, triangles: earclip(points) }
    }),
    new Render({ color: asteroidGray }),
    new Physics({
        currVelocity: scale(direction, 150),
        currAcceleration: [0, 0],
        currRotationalSpeed: 0,
        acceleration: pxPerSec2(0),
        maxVelocity: pxPerSec(150),
        rotationalSpeed: degPerSec(0),
        lastUpdated: performance.now(),
        mass: 1.5,
    }),
    new Collision({
        boundingBox: [[-30, -30], [60, 60]],
        isColliding: false,
        colliders: [],
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
        shape: { type: ShapeType.CIRCLE, radius: 1 }
    }),
    new Render({ color: white }),
    new Weapon({
        lastFiredMs: 0,
        hasFired: false,
        cooldownMs: 500,
        offset: [0, 0],
        ammoType: ItemCode.AMMO_PLASMA_SMALL,
        ammoConsumed: 1,
        fireSound: SoundCode.LASER,
    }),
    new Attachment({
        type: SlotType.WEAPON,
        onRemove: RemoveBehavior.DISCARD,
    }),
]

export const missileLauncher = () => [
    new Transform({
        position: [0, 0],
        direction: Directions.NORTH,
        shape: { type: ShapeType.CIRCLE, radius: 1 }
    }),
    new Render({ color: white }),
    new Weapon({
        lastFiredMs: 0,
        hasFired: false,
        cooldownMs: 2000,
        offset: [0, 0],
        ammoType: ItemCode.AMMO_MISSILE_SMALL,
        ammoConsumed: 1,
        fireSound: SoundCode.LAUNCH
    }),
    new Attachment({
        type: SlotType.WEAPON,
        onRemove: RemoveBehavior.DISCARD,
    }),
]

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
            color: boosterOrange,
            effect: { code: EffectCode.FADE, durationMs: 275, startedMs: performance.now() }
        }),
        new EffectHub({
            effects: [{ type: EffectType.DEATH, durationMs: 250, startedMs: performance.now(), trigger: EffectTriggerType.END }]
        })
    ]
}
