import { Dimensions, Offset } from '../Math'
import { Component, ComponentCode } from './Component'

export interface CollisionState {
    isColliding: boolean
    boundingBox: Readonly<[Offset, Dimensions]>
}

export class Collision extends Component {
    constructor(public state: CollisionState) {
        super(ComponentCode.COLLISION, 'Collision')
    }
}
