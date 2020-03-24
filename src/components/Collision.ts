import { Dimensions, Offset } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export interface CollisionState extends ComponentState {
    isColliding: boolean
    boundingBox: Readonly<[Offset, Dimensions]>
}

export class Collision extends Component {
    constructor(public state: CollisionState) {
        super(ComponentCode.COLLISION, 'Collision', state)
    }
}
