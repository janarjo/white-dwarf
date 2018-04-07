import { Entity } from '../domain/Entity';
import { Player } from '../domain/Player';
import { Projectile } from '../domain/Projectile';
import { Tuple } from '../domain/Types';
import { Dot } from './Dot';
import { Shape } from './Shape';
import { Triangle } from './Triangle';

export class Painter {
    private size: Tuple;
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, size: Tuple) {
        this.ctx = ctx;
        this.size = size;
    }

    paint(entities: ReadonlyArray<Entity>) {
        this.clear();
        entities.forEach((e) => {
            if (e instanceof Player) {
                const triangle = new Triangle(e.position, e.orientation);
                this.drawShape(triangle);
            } else if (e instanceof Projectile) {
                const dot = new Dot(e.position);
                this.drawShape(dot);
            }
        });
    }

    private clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.size[0], this.size[1]);
    }

    private drawShape(shape: Shape) {
        this.ctx.save();
        shape.draw(this.ctx);
        this.ctx.restore();
    }
}
