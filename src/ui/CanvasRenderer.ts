import { Collision } from '../components/Collision'
import { Health } from '../components/Health'
import { Rectangle, ShapeType, Transform } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { Star } from '../LevelManager'
import { add, rotate } from '../Math'
import { Drawer } from './Drawer'
import { Inventory } from '../components/Inventory'
import { Game, UIMode } from '../Game'
import { Render } from '../components/Render'
import { FrameRateDebugInfo } from '../FrameTimeAnalyzer'
import { red, white } from './Colors'

export class CanvasRenderer {
    constructor(
        private readonly entities: EntityManager,
        private readonly drawer: Drawer,
        private readonly stars: ReadonlyArray<Star>) {
    }

    render(debug?: FrameRateDebugInfo) {
        if (Game.mode === UIMode.INVENTORY) {
            const inventory = this.entities
                .withComponents(Inventory)
                .map(id => this.entities.getComponent(id, Inventory))[0]
            this.drawer.drawInventory(inventory.state.items)
            return
        }

        const camera = this.entities.getCamera()

        this.drawer.clear()
        this.drawer.drawStars(this.stars)

        this.entities.withComponents(Transform, Render).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { direction, currShape, position } = transform.state
            if (!currShape) return

            const render = this.entities.getComponent(id, Render)
            const { color, effect } = render.state
            this.drawer.drawShape(currShape, { ...camera.state, position, color, direction, effect })
        })

        this.entities.withComponents(Transform, Render, Health).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { position } = transform.state
            const health = this.entities.getComponent(id, Health)
            if (!health.state.showIndicator) return

            const maxWidth = 32
            const offset = health.state.verticalOffset
            const width = (health.state.health / health.state.maxHealth) * maxWidth

            const shape: Rectangle = { type: ShapeType.RECTANGLE, dimensions: [width, 2], fill: true }
            this.drawer.drawShape(shape, { ...camera.state, color: white, position: add(position, [-(maxWidth / 2), offset]) } )
        })

        /* Debug elements */
        if (!debug) return
        this.drawer.drawDebugInfo(debug, this.entities.getDebugInfo())

        this.entities.withComponents(Transform, Render, Collision).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { position } = transform.state
            const collision = this.entities.getComponent(id, Collision)
            const [offset, dimensions] = collision.state.boundingBox
            const isColliding = collision.state.isColliding

            const shape: Rectangle = { type: ShapeType.RECTANGLE, dimensions, fill: false }
            this.drawer.drawShape(shape, { ...camera.state, color: isColliding ? red : white, position: add(position, offset) } )
        })

        this.entities.withComponents(Transform, Render, Weapon).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { position, direction } = transform.state

            const weapon = this.entities.getComponent(id, Weapon)
            const { offset } = weapon.state
            const firePosition = rotate(position, direction, add(position, offset))

            this.drawer.drawShape({ type: ShapeType.CIRCLE, radius: 1 }, { ...camera.state, position: firePosition, color: red } )
        })
    }
}
