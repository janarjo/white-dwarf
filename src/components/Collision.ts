import { Dimensions, Offset, Position } from '../math/Math'
import { Component, ComponentCode, ComponentState } from './Component'

export enum CollisionGroup {
    PLAYER,
    ENEMY,
}

export interface EntityCollision {
    id: number
    contactPoints: Position[]
}

export interface CollisionState extends ComponentState {
    isColliding: boolean
    collisions: EntityCollision[]
    boundingBox: Readonly<[Offset, Dimensions]>
    group: CollisionGroup
    mask: CollisionGroup[]
}

export class Collision extends Component<CollisionState> {
    constructor(public state: CollisionState) {
        super(ComponentCode.COLLISION, 'Collision', state)
    }
}
