import { Position } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export interface TransformState extends ComponentState {
    position: Position
    orientation: number
}

export class Transform extends Component {
    constructor(public state: TransformState) {
        super(ComponentCode.TRANSFORM, 'Core', state)
    }
}
