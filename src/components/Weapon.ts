import { Offset } from '../Math'
import { Component, ComponentCode } from './Component'

export interface WeaponState {
    lastFired: number
    cooldown: number
    offset: Offset
}

export class Weapon extends Component {
    constructor(public state: WeaponState) {
        super(ComponentCode.WEAPON, 'Weapon')
    }
}
