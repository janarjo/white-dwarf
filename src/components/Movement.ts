import { Vector } from '../math/Vector';
import { Component, ComponentCode } from './Components';

export interface MovementState {
    speed: number;
    acceleration: number;
    maxSpeed: number;
}

export class Movement extends Component {
    constructor(public state: MovementState) {
        super(ComponentCode.MOVEMENT, 'Movement', state);
    }
}
