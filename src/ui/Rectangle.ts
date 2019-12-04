import { Dimensions, Position } from '../Math'
import { Shape, ShapeType } from './Shape'

export class Rectangle extends Shape {
    constructor(
            position: Position,
            protected dimensions: Dimensions,
            protected fill: boolean = false,
            color: string = 'white') {
        super(ShapeType.DOT, position, color)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        if (this.fill) {
            ctx.fillStyle = this.color
            ctx.fillRect(this.position[0], this.position[1], this.dimensions[0], this.dimensions[1])
        } else {
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.position[0], this.position[1], this.dimensions[0], this.dimensions[1])
        }
        ctx.stroke()
    }
}
