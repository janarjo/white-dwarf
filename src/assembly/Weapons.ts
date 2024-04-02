import { ItemCode } from '../Items'
import { Directions } from '../Math'
import { SoundCode } from '../SoundManager'
import { Attachment, RemoveBehavior } from '../components/Attachment'
import { SlotType } from '../components/EntityHub'
import { Render } from '../components/Render'
import { Transform, ShapeType } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { white } from '../ui/Colors'

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
