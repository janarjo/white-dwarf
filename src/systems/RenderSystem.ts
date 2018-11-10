import { ComponentCode } from '../components/Components';
import { Core } from '../components/Core';
import { Render } from '../components/Render';
import { EntityManager } from '../EntityManager';
import { EventManager } from '../EventManager';
import { Vector } from '../math/Vector';
import { Dot } from '../ui/Dot';
import { Shape, ShapeType } from '../ui/Shape';
import { Triangle } from '../ui/Triangle';
import { System } from './System';

export class RenderSystem extends System {
    constructor(
        readonly entityManager: EntityManager,
        readonly eventManager: EventManager,
        readonly ctx: CanvasRenderingContext2D,
        readonly size: Vector) {
            super(entityManager, eventManager);
    }

    update() {
        this.clear();
        this.entityManager.entities.forEach((entity) => {
            const core = entity.getComponent(ComponentCode.CORE) as Core | undefined;
            const render = entity.getComponent(ComponentCode.RENDER) as Render | undefined;
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
