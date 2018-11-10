import { ShapeType } from '../ui/Shape';
import { Component, ComponentCode } from './Components';

export interface RenderState {
    type: ShapeType;
}

export class Render extends Component {
    constructor(public state: RenderState) {
        super(ComponentCode.RENDER, 'Render', state);
    }
}
