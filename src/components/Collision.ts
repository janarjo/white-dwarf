import { Rectangle } from '../math/Rectangle'
import { Component, ComponentCode } from './Component'

export interface CollisionState {
    isColliding: boolean
    boundingBox: Rectangle
}

export class Collision extends Component {
    constructor(public state: CollisionState) {
        super(ComponentCode.COLLISION, 'Collision', state)
    }
}
