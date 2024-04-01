import { ItemCode } from '../Items'
import { Offset } from '../Math'
import { SoundCode } from '../SoundManager'
import { Component, ComponentCode, ComponentState } from './Component'

export interface WeaponState extends ComponentState {
    lastFiredMs: number
    cooldownMs: number
    offset: Offset
    hasFired: boolean
    ammoType: ItemCode
    ammoConsumed: number
    fireSound?: SoundCode
}

export class Weapon extends Component {
    constructor(public state: WeaponState) {
        super(ComponentCode.WEAPON, 'Weapon', state)
    }
}
