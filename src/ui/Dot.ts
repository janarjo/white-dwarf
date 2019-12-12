import { Position, subtract } from '../Math'
import { Shape, ShapeType } from './Shape'

export class Dot extends Shape {
    constructor(
            position: Position,
            color: string = 'white') {
        super(ShapeType.DOT, position, color)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        const [x, y] = this.position
        ctx.fillRect(x, y, 2, 2)
        ctx.stroke()
    }
}
