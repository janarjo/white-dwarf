import { Component, ComponentCode } from './Components';

export interface WeaponState {
    attackSpeed: number;
    projectileSpeed: number;
}

export class Weapon extends Component {
    constructor(public state: WeaponState) {
        super(ComponentCode.WEAPON, 'Weapon', state);
    }
}
