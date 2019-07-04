import { Vector } from '../math/Vector';
import { Component, ComponentCode } from './Component';

export interface CoreState {
    position: Vector;
    orientation: number;
}

export class Core extends Component {
    constructor(public state: CoreState) {
        super(ComponentCode.CORE, 'Core', state);
    }
}
