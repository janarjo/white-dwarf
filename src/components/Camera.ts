import { Position } from '../math/Math'
import { Component, ComponentCode, ComponentState } from './Component'

export interface CameraState extends ComponentState {
    origin: Position
    zoom: number
}

export class Camera extends Component {
    constructor(public state: CameraState) {
        super(ComponentCode.CAMERA, 'Camera', state)
    }
}
