import { Camera } from '../components/Camera'
import { Collision } from '../components/Collision'
import { Health } from '../components/Health'
import { Render } from '../components/Render'
import { Transform } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { Star } from '../LevelManager'
import { add, rotate, subtract } from '../Math'
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
        private readonly stars: ReadonlyArray<Star>,
        private readonly isDebug: boolean) {
        super()
    }

    update() {
        const camera = this.entities
            .withComponents(Camera)
            .map(id => this.entities.getComponent(id, Camera))[0]
        if (!camera) throw Error('No camera found!')
        const origin = camera.state.origin
        this.clear()
        this.drawStars()

        this.entities.withComponents(Transform, Render).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const orientation = transform.state.orientation
            const render = this.entities.getComponent(id, Render)

            let shape: Shape | undefined
            switch (render.state.type) {
                case ShapeType.DOT: {
                    shape = new Dot(position)
                    break
                }
                case ShapeType.TRIANGLE: {
                    shape = new Triangle(position, orientation)
                    break
                }
                case ShapeType.CIRCLE: {
                    shape = new Circle(position, 20)
                    break
                }
            }
            shape && this.drawShape(shape)
        })

        this.entities.withComponents(Transform, Render, Health).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const health = this.entities.getComponent(id, Health)
            if (!health.state.showIndicator) return

            const maxWidth = 32
            const offset = health.state.verticalOffset
            const width = (health.state.health / health.state.maxHealth) * maxWidth

            const shape = new Rectangle(add(position, [-(maxWidth / 2), offset]), [width, 2], true, 'white')
            this.drawShape(shape)
        })

        /* Debug elements */
        if (!this.isDebug) return
        this.drawDebugInfo()

        this.entities.withComponents(Transform, Render, Collision).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const collision = this.entities.getComponent(id, Collision)
            const [offset, dimensions] = collision.state.boundingBox
            const isColliding = collision.state.isColliding

            const shape = new Rectangle(add(position, offset), dimensions, false, isColliding ? 'red' : 'white')
            this.drawShape(shape)
        })

        this.entities.withComponents(Transform, Render, Weapon).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const { orientation } = transform.state
            const weapon = this.entities.getComponent(id, Weapon)
            const { offset } = weapon.state
            const firePosition = rotate(position, orientation, add(position, offset))

            this.drawShape(new Dot(firePosition, 'red'))
        })
    }

    private drawDebugInfo() {
        const { playerPosition, entityCount, componentCount } = this.entities.getDebugInfo()
        const [ playerX, playerY ] = playerPosition

        this.ctx.save()
        this.ctx.font = '12px Arial'
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(`Position: ${playerX.toFixed(0)}, ${playerY.toFixed(0)}`, 10, 20)
        this.ctx.fillText(`Entities: ${entityCount}`, 10, 34)
        this.ctx.fillText(`Components: ${componentCount}`, 10, 48)
        this.ctx.restore()
    }

    private clear() {
        this.ctx.fillStyle = 'black'
        const { width, height } = this.ctx.canvas
        this.ctx.fillRect(0, 0, width, height)
    }

    private drawStars() {
        this.ctx.save()
        this.stars.forEach(star => {
            const { intensity, position } = star
            const rgb = `rgb(${intensity},${intensity},${intensity})`
            this.ctx.fillStyle = rgb
            this.ctx.fillRect(position[0], position[1], 1, 1)
        })
        this.ctx.restore()
    }

    private drawShape(shape: Shape) {
        this.ctx.save()
        shape.draw(this.ctx)
        this.ctx.restore()
    }
}
