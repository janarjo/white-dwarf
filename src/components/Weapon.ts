import { ItemCode } from '../Items'
import { Offset } from '../Math'
import { SoundCode } from '../SoundManager'
import { ProjectileCode } from '../assembly/Projectiles'
import { Component, ComponentCode, ComponentState } from './Component'

export interface WeaponState extends ComponentState {
    lastFiredMs: number
    cooldownMs: number
    offset: Offset
    hasFired: boolean
    projectileRef: ProjectileCode
    ammoType: ItemCode
    ammoConsumed: number
    fireSound?: SoundCode
}

export class Weapon extends Component {
    constructor(public state: WeaponState) {
        super(ComponentCode.WEAPON, 'Weapon', state)
    }
}
