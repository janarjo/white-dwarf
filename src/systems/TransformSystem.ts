import { EntityHub } from '../components/EntityHub'
import { Movement } from '../components/Movement'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, hvec, isWithin, rotate, scale, Vector, rad } from '../Math'
import { System } from './System'

export class TransformSystem extends System {
    constructor(
        readonly entities: EntityManager,
        readonly mapSize: Vector) {
        super()
    }

    private readonly paddedMapSize = [[-100, -100], add(this.mapSize, [100, 100])] as const

    update() {
        this.entities.withComponents(Transform).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            if (!isWithin(transform.state.position, this.paddedMapSize)) this.entities.remove(id)
        })

        this.entities.withComponents(Transform, Movement).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const movement = this.entities.getComponent(id, Movement)

            const { position, direction, lastUpdated } = transform.state
            const { currVelocity, currRotationalSpeed } = movement.state
            
            const now = performance.now()
            const elapsedSec = (now - lastUpdated) * 0.001

            transform.state = {
                ...transform.state,
                position: add(position, scale(currVelocity, elapsedSec)),
                direction: rotate(direction, hvec(currRotationalSpeed * elapsedSec)),
                lastUpdated: now
            }
        })

        this.entities.withComponents(Transform, EntityHub).forEach((id) => {
            const transform = this.entities.getComponent(id, Transform)
            const { position, direction } = transform.state

            const hub = this.entities.getComponent(id, EntityHub)
            hub.state.slots.forEach(slot => {
                const { attachmentId, offset } = slot
                if (!attachmentId) return

                const attachmentTransform = this.entities.getComponentOrNone(attachmentId, Transform)
                if (!attachmentTransform) return

                attachmentTransform.state = {
                    ...attachmentTransform.state,
                    position: rotate(add(position, offset), direction, position),
                    direction: direction
                }
            })
        })
    }
}
