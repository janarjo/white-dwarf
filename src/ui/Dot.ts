import { Vector } from '../math/Vector'
import { Shape, ShapeType } from './Shape'

export class Dot extends Shape {
    constructor(
            position: Vector,
            color: string = 'white') {
        super(ShapeType.DOT, position, color)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.position[0], this.position[1], 2, 2)
        ctx.stroke()
    }
}
