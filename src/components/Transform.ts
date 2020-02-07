import { Position } from '../Math'
import { Component, ComponentCode } from './Component'

export interface TransformState {
    position: Position
    orientation: number
}

export class Transform extends Component {
    constructor(public state: TransformState) {
        super(ComponentCode.TRANSFORM, 'Core')
    }
}
