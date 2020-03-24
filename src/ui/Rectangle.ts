import { Dimensions, Position } from '../Math'
import { Shape, ShapeType } from './Shape'

export class Rectangle extends Shape {
    constructor(
            position: Position,
            protected dimensions: Dimensions,
            protected fill: boolean = false,
            color = 'white') {
        super(ShapeType.DOT, position, color)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        const [ x, y ] = this.position
        const [ w, h ] = this.dimensions
        if (this.fill) {
            ctx.fillStyle = this.color
            ctx.fillRect(x, y, w, h)
        } else {
            ctx.strokeStyle = this.color
            ctx.strokeRect(x, y, w, h)
        }
        ctx.stroke()
    }
}
