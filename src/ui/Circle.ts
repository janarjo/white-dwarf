import { Vector } from '../math/Vector';
import { Shape, ShapeType } from './Shape';

export class Circle extends Shape {
    constructor(
            position: Vector,
            color: string,
            protected lineWidth: number = 2,
            protected radius: number = 2) {
        super(ShapeType.CIRCLE, position, color);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
