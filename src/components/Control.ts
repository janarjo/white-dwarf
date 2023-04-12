import { Position } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export interface ControlState extends ComponentState {
    isFiring: boolean
    isAccelerating: boolean
    isDecelerating: boolean
    isTurningLeft: boolean
    isTurningRight: boolean
    isBraking: boolean
    mousePos?: Position
}

export class Control extends Component {
    constructor(public state: ControlState) {
        super(ComponentCode.CONTROL, 'Control', state)
    }
}
