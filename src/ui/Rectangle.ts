import { Vector } from '../math/Vector'
import { Shape, ShapeType } from './Shape'

export class Rectangle extends Shape {
    constructor(
            position: Vector,
            protected width: number,
            protected height: number,
            protected fill: boolean = false,
            color: string = 'white') {
        super(ShapeType.DOT, position, color)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.position[0], this.position[1], this.width, this.height)
        ctx.stroke()
    }
}
