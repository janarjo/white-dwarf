import { ShapeType } from '../ui/Shape'
import { Component, ComponentCode } from './Component'

export interface RenderState {
    type: ShapeType
}

export class Render extends Component {
    constructor(public state: RenderState) {
        super(ComponentCode.RENDER, 'Render')
    }
}
