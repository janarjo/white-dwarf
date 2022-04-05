import { Collision, CollisionState } from '../components/Collision'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, isIntersect, Rectangle } from '../Math'
import { System } from './System'

export class CollisionSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update() {
        const collideableEntities = this.entities.withComponents(Transform, Collision)
        collideableEntities.forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const collision = this.entities.getComponent(id, Collision)
            const thisBoundingBox = this.getBoundingBox(transform.state, collision.state)

            const hasAnyCollision = collideableEntities
                .filter(otherId => id !== otherId)
                .some(otherId => {
                    const otherCollision = this.entities.getComponent(otherId, Collision)
                    if (!collision.state.mask.includes(otherCollision.state.group)) return false
                    
                    const otherTransform = this.entities.getComponent(otherId, Transform)
                    const otherBoundingBox: Rectangle = this.getBoundingBox(otherTransform.state, otherCollision.state)

                    return isIntersect(thisBoundingBox, otherBoundingBox)
                })
            collision.state.isColliding = hasAnyCollision
        })
    }

    private getBoundingBox(transformState: TransformState, collisionState: CollisionState): Rectangle {
        const pos = transformState.position
        const [offset, dimensions] = collisionState.boundingBox
        return [add(pos, offset), dimensions]
    }
}
