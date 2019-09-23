import { stat } from 'fs';
import { Collision, CollisionState } from '../components/Collision'
import { Movement } from '../components/Movement'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { isIntersect } from '../math/Rectangle';
import { add, subtract, Vector } from '../math/Vector'
import { System } from './System'

export class CollisionSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(Transform, Collision, Movement).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { orientation } = transform.state
            const movement = this.entities.getComponent(id, Movement)
            const { currSpeed } = movement.state
            const collision = this.entities.getComponent(id, Collision)

            collision.state = this.updateBoundingPoxPosition(collision.state, currSpeed, orientation)
        })

        const collideableEntities = this.entities.withComponents(Collision)
        collideableEntities.forEach(id => {
            const collision = this.entities.getComponent(id, Collision)

            collideableEntities.forEach((otherId) => {
                if (id === otherId) return;
                const otherCollision = this.entities.getComponent(otherId, Collision)
                collision.state = this.updateCollisionState(collision.state, otherCollision.state)
            })
        })
    }

    private updateBoundingPoxPosition(state: CollisionState, speed: number, orientation: number): CollisionState {
        const [pos, width, height] = state.boundingBox
        const motionX = speed * Math.cos(orientation)
        const motionY = speed * Math.sin(orientation)
        const newPos = add(pos, [motionX, motionY])

        return { ...state, boundingBox: [newPos, width, height] }
    }

    private updateCollisionState(state1: CollisionState, state2: CollisionState): CollisionState {
        const isColliding = isIntersect(state1.boundingBox, state2.boundingBox)
        return { ...state1, isColliding }
    }
}
