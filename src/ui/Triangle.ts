import { rotate } from '../math/Utils';
import { Vector } from '../math/Vector';
import { Shape } from './Shape';

export class Triangle extends Shape {
    constructor(
            position: Vector,
            protected orientation: number,
            color: string = 'white',
            protected base: number = 30,
            protected height: number = 50) {
        super(position, color);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        const centerX = this.position.x;
        const centerY = this.position.y;
        const halfHeight = (this.height / 2);
        const halfBase = (this.base / 2);

        const pointA = new Vector(centerX - halfBase, centerY - halfHeight);
        const pointB = new Vector(centerX, centerY + halfHeight);
        const pointC = new Vector(centerX + halfBase, centerY - halfHeight);

        const rotatedPoints = rotate(this.position, this.orientation, [pointA, pointB, pointC]);

        const rotatedPointA = rotatedPoints[0];
        const rotatedPointB = rotatedPoints[1];
        const rotatedPointC = rotatedPoints[2];

        ctx.moveTo(rotatedPointA.x, rotatedPointA.y);
        ctx.lineTo(rotatedPointB.x, rotatedPointB.y);
        ctx.lineTo(rotatedPointC.x, rotatedPointC.y);
        ctx.lineTo(rotatedPointA.x, rotatedPointA.y);
        ctx.fill();
    }
}
