import { Vector } from '../math/Vector';
import { Component, ComponentCode } from './Component';

export interface CollisionState {
    isColliding: boolean;
    boundingBox: Readonly<[Vector, number, number]>;
}

export class Collision extends Component {
    constructor(public state: CollisionState) {
        super(ComponentCode.COLLISION, 'Collision', state);
    }
}
