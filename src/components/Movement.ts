import { Vector } from '../Math'
import { Acceleration, RateOfRotation, Speed } from '../Units'
import { Component, ComponentCode, ComponentState } from './Component'

export interface MovementState extends ComponentState {
    currVelocity: Vector
    currAcceleration: Vector
    currRotationalSpeed: number
    acceleration: Acceleration
    rotationalSpeed: RateOfRotation
    maxSpeed: Speed
}

export class Movement extends Component {
    constructor(public state: MovementState) {
        super(ComponentCode.MOVEMENT, 'Movement', state)
    }
}
