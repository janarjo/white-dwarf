import { Component, ComponentCode, ComponentState } from './Component'

export interface MovementState  extends ComponentState {
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
