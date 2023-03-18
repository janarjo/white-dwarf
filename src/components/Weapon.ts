import { Offset } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export interface WeaponState extends ComponentState {
    lastFiredMs: number
    cooldownMs: number
    offset: Offset
    hasFired: boolean
}

export class Weapon extends Component {
    constructor(public state: WeaponState) {
        super(ComponentCode.WEAPON, 'Weapon', state)
    }
}
