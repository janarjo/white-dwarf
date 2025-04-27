import { Position } from '../math/Math'
import { Component, ComponentCode, ComponentState } from './Component'

export interface ControlState extends ComponentState {
    isFiring: boolean
    isAccelerating: boolean
    isDecelerating: boolean
    isTurningLeft: boolean
    isTurningRight: boolean
    isBraking: boolean
    canvasPointer?: Position
    quickSlotIndex: number
    zoomFactor: number
}

export class Control extends Component {
    constructor(public state: ControlState) {
        super(ComponentCode.CONTROL, 'Control', state, true)
    }
}
