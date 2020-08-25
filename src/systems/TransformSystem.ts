import { Hub } from '../components/Hub'
import { Movement } from '../components/Movement'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, isWithin, Position, rotate, Vector, Rectangle } from '../Math'
import { System } from './System'

export class TransformSystem extends System {
    constructor(
        readonly entities: EntityManager,
        readonly mapSize: Vector) {
        super()
    }

    update() {
        this.entities.withComponents(Transform).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const killRect: Rectangle = [[-100, -100], add(this.mapSize, [100, 100])] as const
            if (!isWithin(transform.state.position, killRect)) this.entities.remove(id)
        })

        this.entities.withComponents(Transform, Movement).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const movement = this.entities.getComponent(id, Movement)

            transform.state = {
                ...transform.state,
                orientation: this.getOrientation(transform.state, movement.state.currRotationalSpeed),
                position: this.getPosition(transform.state, movement.state.currSpeed),
            }
        })

        this.entities.withComponents(Transform, Hub).forEach((id) => {
            const transform = this.entities.getComponent(id, Transform)
            const { position, orientation } = transform.state

            const hub = this.entities.getComponent(id, Hub)
            hub.state.slots.forEach(slot => {
                const { attachmentId, offset } = slot
                if (!attachmentId) return

                const attachmentTransform = this.entities.getComponentOrNone(attachmentId, Transform)
                if (!attachmentTransform) return

                attachmentTransform.state = {
                    ...attachmentTransform.state,
                    orientation,
                    position: rotate(position, orientation, add(position, offset)),
                }
            })
        })
    }

    private getOrientation(state: TransformState, turningSpeed: number): number {
        return state.orientation + turningSpeed
    }

    private getPosition(state: TransformState, speed: number): Position {
        const { position, orientation } = state
        const motionX = speed * Math.cos(orientation)
        const motionY = speed * Math.sin(orientation)
        return add(position, [motionX, motionY])
    }
}
