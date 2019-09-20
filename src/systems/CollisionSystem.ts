import { Collision, CollisionState } from '../components/Collision'
import { Movement } from '../components/Movement'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
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
    }

    private updateBoundingPoxPosition(state: CollisionState, speed: number, orientation: number): CollisionState {
        const [pos, width, height] = state.boundingBox
        const motionX = speed * Math.cos(orientation)
        const motionY = speed * Math.sin(orientation)
        const newPos = add(pos, [motionX, motionY])

        return { ...state, boundingBox: [newPos, width, height] }
    }
}
