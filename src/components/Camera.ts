import { Position } from '../Math'
import { Component, ComponentCode } from './Component'

export interface CameraState {
    origin: Position,
}

export class Camera extends Component {
    constructor(public state: CameraState) {
        super(ComponentCode.CAMERA, 'Camera', state)
    }
}
