import { Vector } from '../math/Math'
import { Acceleration, RateOfRotation, Speed } from '../Units'
import { Component, ComponentCode, ComponentState } from './Component'

export interface PhysicsState extends ComponentState {
    currVelocity: Vector
    currAcceleration: Vector
    currRotationalSpeed: number
    acceleration: Acceleration
    rotationalSpeed: RateOfRotation
    maxVelocity: Speed
    mass: number
}

export class Physics extends Component<PhysicsState> {
    constructor(public state: PhysicsState) {
        super(ComponentCode.PHYSICS, 'Physics', state, true)
    }
}
