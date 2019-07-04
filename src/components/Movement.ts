import { Component, ComponentCode } from './Component';

export interface MovementState {
    speed: number;
    acceleration: number;
    maxSpeed: number;
    turningSpeed: number;
}

export class Movement extends Component {
    constructor(public state: MovementState) {
        super(ComponentCode.MOVEMENT, 'Movement', state);
    }
}
