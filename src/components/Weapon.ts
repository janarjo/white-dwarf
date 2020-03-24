import { Offset } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export interface WeaponState extends ComponentState {
    lastFired: number
    cooldown: number
    offset: Offset
}

export class Weapon extends Component {
    constructor(public state: WeaponState) {
        super(ComponentCode.WEAPON, 'Weapon', state)
    }
}
