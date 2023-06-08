import { Collision } from '../components/Collision'
import { Health } from '../components/Health'
import { Rectangle, ShapeType, Transform } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { Star } from '../LevelManager'
import { add, rotate, subtract } from '../Math'
import { System } from './System'
import { Drawer } from '../ui/Drawer'
import { Inventory } from '../components/Inventory'
import { Game, UIMode } from '../Game'
import { Render } from '../components/Render'

export class RenderSystem implements System {
    constructor(
        private readonly entities: EntityManager,
        private readonly drawer: Drawer,
        private readonly stars: ReadonlyArray<Star>,
        private readonly isDebug: boolean) {
    }

    update() {
        if (Game.mode === UIMode.INVENTORY) {
            const inventory = this.entities
                .withComponents(Inventory)
                .map(id => this.entities.getComponent(id, Inventory))[0]
            this.drawer.drawInventory(inventory.state.items)
            return
        }

        const camera = this.entities.getCamera()
        const origin = camera.state.origin

        this.drawer.clear()
        this.drawer.drawStars(this.stars)

        this.entities.withComponents(Transform, Render).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { direction, shape, currShape, position } = transform.state
            if (!shape) return

            const render = this.entities.getComponent(id, Render)
            const { color, effect } = render.state

            const oPosition = subtract(position, origin)
            const drawParams = { position: oPosition, color, direction, effect }

            if (currShape?.type === ShapeType.POLYGON) {
                const oPoints = currShape.points.map(p => subtract(p, origin))
                this.drawer.drawShape({ ...currShape, points: oPoints }, drawParams)
                return
            }

            this.drawer.drawShape(shape, drawParams)
        })

        this.entities.withComponents(Transform, Render, Health).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const oPosition = subtract(transform.state.position, origin)
            const health = this.entities.getComponent(id, Health)
            if (!health.state.showIndicator) return

            const maxWidth = 32
            const offset = health.state.verticalOffset
            const width = (health.state.health / health.state.maxHealth) * maxWidth

            const shape: Rectangle = { type: ShapeType.RECTANGLE, dimensions: [width, 2], fill: true }
            this.drawer.drawShape(shape, { color: 'white', position: add(oPosition, [-(maxWidth / 2), offset]) } )
        })

        /* Debug elements */
        if (!this.isDebug) return
        this.drawer.drawDebugInfo(this.entities.getDebugInfo())

        this.entities.withComponents(Transform, Render, Collision).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const oPosition = subtract(transform.state.position, origin)
            const collision = this.entities.getComponent(id, Collision)
            const [offset, dimensions] = collision.state.boundingBox
            const isColliding = collision.state.isColliding

            const shape: Rectangle = { type: ShapeType.RECTANGLE, dimensions, fill: false }
            this.drawer.drawShape(shape, { color: isColliding ? 'red' : 'white', position: add(oPosition, offset) } )
        })

        this.entities.withComponents(Transform, Render, Weapon).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const oPosition = subtract(transform.state.position, origin)
            const direction = transform.state.direction

            const weapon = this.entities.getComponent(id, Weapon)
            const { offset } = weapon.state
            const firePosition = rotate(oPosition, direction, add(oPosition, offset))

            this.drawer.drawShape({ type: ShapeType.DOT, }, { position: firePosition, color: 'red' } )
        })
    }
}
