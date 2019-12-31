import { Attachment } from '../components/Attachment'
import { Movement } from '../components/Movement'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, isWithin, Vector } from '../Math'
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
            if (!isWithin(transform.state.position, this.mapSize)) this.entities.remove(id)
        })

        this.entities.withComponents(Transform, Movement).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const movement = this.entities.getComponent(id, Movement)

            transform.state = this.updateOrientation(transform.state, movement.state.currRotationalSpeed)
            transform.state = this.updatePosition(transform.state, movement.state.currSpeed)
        })

        this.entities.withComponents(Transform, Attachment).forEach((id) => {
            const transform = this.entities.getComponent(id, Transform)
            const position = transform.state.position
            const attachment = this.entities.getComponent(id, Attachment)
            attachment.state.attachments.forEach(attachmentInfo => {
                const { childId, offset } = attachmentInfo
                const childTransform = this.entities.getComponentOrNone(childId, Transform)
                if (!childTransform) return

                childTransform.state.position = add(position, offset)
            })
        })
    }

    private updateOrientation(state: TransformState, turningSpeed: number): TransformState {
        const newOrientation = state.orientation + turningSpeed
        return { ...state, orientation: newOrientation }
    }

    private updatePosition(state: TransformState, speed: number): TransformState {
        const motionX = speed * Math.cos(state.orientation)
        const motionY = speed * Math.sin(state.orientation)
        const newPosition = add(state.position, [motionX, motionY])
        return { ...state, position: newPosition }
    }
}
