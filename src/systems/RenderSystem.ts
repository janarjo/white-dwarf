import { Core } from '../components/Core';
import { Render } from '../components/Render';
import { Entities } from '../entities/Entities';
import { Vector } from '../math/Vector';
import { Dot } from '../ui/Dot';
import { Shape, ShapeType } from '../ui/Shape';
import { Triangle } from '../ui/Triangle';
import { System } from './System';

export class RenderSystem extends System {
    constructor(
        private readonly entities: Entities,
        private readonly ctx: CanvasRenderingContext2D,
        private readonly size: Vector) {
        super();
    }

    update() {
        this.clear();
        this.entities.entities.forEach(entity => {
            const core = entity.getComponent(Core);
            const render = entity.getComponent(Render);
            if (core && render) {
                let shape: Shape | undefined;
                switch (render.state.type) {
                    case ShapeType.DOT: {
                        shape = new Dot(core.state.position);
                        break;
                    }
                    case ShapeType.TRIANGLE: {
                        shape = new Triangle(core.state.position, core.state.orientation);
                        break;
                    }
                }
                shape && this.drawShape(shape);
            }
        });
    }

    private clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    }

    private drawShape(shape: Shape) {
        this.ctx.save();
        shape.draw(this.ctx);
        this.ctx.restore();
    }
}
