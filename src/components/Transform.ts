import { Vector } from '../math/Vector';
import { Component, ComponentCode } from './Component';

export interface TransformState {
    position: Vector;
    orientation: number;
}

export class Transform extends Component {
    constructor(public state: TransformState) {
        super(ComponentCode.TRANSFORM, 'Core', state);
    }
}
