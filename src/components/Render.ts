import { ShapeType } from '../ui/Shape'
import { Component, ComponentCode, ComponentState } from './Component'

export interface RenderState  extends ComponentState {
    type: ShapeType
}

export class Render extends Component {
    constructor(public state: RenderState) {
        super(ComponentCode.RENDER, 'Render', state)
    }
}
