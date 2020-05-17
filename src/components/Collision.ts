import { Dimensions, Offset } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export enum CollisionGroup {
    PLAYER,
    ENEMY,
}

export interface CollisionState extends ComponentState {
    isColliding: boolean
    boundingBox: Readonly<[Offset, Dimensions]>
    group: CollisionGroup
    mask: CollisionGroup[]
}

export class Collision extends Component {
    constructor(public state: CollisionState) {
        super(ComponentCode.COLLISION, 'Collision', state)
    }
}
