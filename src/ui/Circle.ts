import { Vector } from '../math/Vector';
import { Shape, ShapeType } from './Shape';

export class Circle extends Shape {
    constructor(
            position: Vector,
            protected radius: number,
            protected fill: boolean = false,
            color: string = 'white',
            protected lineWidth: number = 2) {
        super(ShapeType.CIRCLE, position, color);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }
}
