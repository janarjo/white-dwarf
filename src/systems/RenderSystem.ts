import { Collision } from '../components/Collision'
import { Render } from '../components/Render'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, Vector } from '../Math'
import { Circle } from '../ui/Circle'
import { Dot } from '../ui/Dot'
import { Rectangle } from '../ui/Rectangle'
import { Shape, ShapeType } from '../ui/Shape'
import { Triangle } from '../ui/Triangle'
import { System } from './System'

export class RenderSystem extends System {
    constructor(
        private readonly entities: EntityManager,
        private readonly ctx: CanvasRenderingContext2D,
        private readonly size: Vector) {
        super()
    }

    update() {
        this.clear()
        this.entities.withComponents(Transform, Render).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const render = this.entities.getComponent(id, Render)

            let shape: Shape | undefined
            switch (render.state.type) {
                case ShapeType.DOT: {
                    shape = new Dot(transform.state.position)
                    break
                }
                case ShapeType.TRIANGLE: {
                    shape = new Triangle(transform.state.position, transform.state.orientation)
                    break
                }
                case ShapeType.CIRCLE: {
                    shape = new Circle(transform.state.position, 20)
                    break
                }
            }
            shape && this.drawShape(shape)
        })
        this.entities.withComponents(Transform, Render, Collision).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = transform.state.position
            const collision = this.entities.getComponent(id, Collision)
            const [offset, dimensions] = collision.state.boundingBox
            const isColliding = collision.state.isColliding

            this.drawShape(new Rectangle(add(position, offset), dimensions, false, isColliding ? 'red' : 'white'))
        })
    }

    private clear() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.size[0], this.size[1])
    }

    private drawShape(shape: Shape) {
        this.ctx.save()
        shape.draw(this.ctx)
        this.ctx.restore()
    }
}
