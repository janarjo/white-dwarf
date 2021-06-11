import { Camera } from '../components/Camera'
import { Collision } from '../components/Collision'
import { Health } from '../components/Health'
import { Render, ShapeType, Rectangle } from '../components/Render'
import { Transform } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { Star } from '../LevelManager'
import { add, rotate, subtract } from '../Math'
import { System } from './System'
import { Drawer } from '../ui/Drawer'

export class RenderSystem extends System {
    constructor(
        private readonly entities: EntityManager,
        private readonly drawer: Drawer,
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
        this.drawer.clear()
        this.drawer.drawStars(this.stars)

        this.entities.withComponents(Transform, Render).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const direction = transform.state.direction
            
            const render = this.entities.getComponent(id, Render)
            const { shape, effect } = render.state

            this.drawer.drawShape(shape, { position, direction, effect })
        })

        this.entities.withComponents(Transform, Render, Health).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const health = this.entities.getComponent(id, Health)
            if (!health.state.showIndicator) return

            const maxWidth = 32
            const offset = health.state.verticalOffset
            const width = (health.state.health / health.state.maxHealth) * maxWidth

            const shape: Rectangle = { type: ShapeType.RECTANGLE, color: 'white', dimensions: [width, 2], fill: true }
            this.drawer.drawShape(shape, { position: add(position, [-(maxWidth / 2), offset]) } )
        })

        /* Debug elements */
        if (!this.isDebug) return
        this.drawer.drawDebugInfo(this.entities.getDebugInfo())

        this.entities.withComponents(Transform, Render, Collision).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const collision = this.entities.getComponent(id, Collision)
            const [offset, dimensions] = collision.state.boundingBox
            const isColliding = collision.state.isColliding

            const shape: Rectangle = { type: ShapeType.RECTANGLE, color: isColliding ? 'red' : 'white', dimensions, fill: false }
            this.drawer.drawShape(shape, { position: add(position, offset) } )
        })

        this.entities.withComponents(Transform, Render, Weapon).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const direction = transform.state.direction

            const weapon = this.entities.getComponent(id, Weapon)
            const { offset } = weapon.state
            const firePosition = rotate(position, direction, add(position, offset))

            this.drawer.drawShape({ type: ShapeType.DOT, color: 'red'}, { position: firePosition } )
        })
    }
}
