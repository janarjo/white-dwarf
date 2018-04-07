import { Vector } from '../math/Vector';
import { Shape } from './Shape';

export class Dot extends Shape {
    constructor(
            position: Vector,
            color: string = 'white') {
        super(position, color);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, 2, 2);
        ctx.stroke();
    }
}
