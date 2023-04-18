import { EntityHub } from '../components/EntityHub'
import { Physics } from '../components/Physics'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, hvec, isWithin, rotate, scale, Vector } from '../Math'
import { Time } from '../Units'
import { System } from './System'

export class TransformSystem implements System {
    constructor(
        readonly entities: EntityManager,
        readonly mapSize: Vector) {
    }

    private readonly paddedMapSize = [[-100, -100], add(this.mapSize, [100, 100])] as const

    update(dt: Time) {
        this.entities.withComponents(Transform).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            if (!isWithin(transform.state.position, this.paddedMapSize)) this.entities.remove(id)
        })

        this.entities.withComponents(Transform, Physics).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const physics = this.entities.getComponent(id, Physics)

            const { position, direction } = transform.state
            const { currVelocity, currRotationalSpeed } = physics.state
            
            transform.state = {
                ...transform.state,
                position: add(position, scale(currVelocity, dt.toSec())),
                direction: rotate(direction, hvec(currRotationalSpeed * dt.toSec()))
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
