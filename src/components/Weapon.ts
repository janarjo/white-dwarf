import { Component, ComponentCode } from './Component';

export interface WeaponState {
    lastFired: number;
    cooldown: number;
}

export class Weapon extends Component {
    constructor(public state: WeaponState) {
        super(ComponentCode.WEAPON, 'Weapon', state);
    }
}
