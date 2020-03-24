import { Position } from '../Math'
import { Shape, ShapeType } from './Shape'

export class Circle extends Shape {
    constructor(
            position: Position,
            protected radius: number,
            protected fill: boolean = false,
            color = 'white',
            protected lineWidth: number = 2) {
        super(ShapeType.CIRCLE, position, color)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.lineWidth = this.lineWidth
        const [x, y] = this.position
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI, true)
        ctx.closePath()
        ctx.fill()
    }
}
