import { Component, ComponentCode } from './Component'

export interface MovementState {
    currSpeed: number
    currAcceleration: number
    currRotationalSpeed: number
    acceleration: number
    rotationalSpeed: number
    maxSpeed: number
}

export class Movement extends Component {
    constructor(public state: MovementState) {
        super(ComponentCode.MOVEMENT, 'Movement', state)
    }
}
