import { Control, ControlState } from '../components/Control'
import { Movement, MovementState } from '../components/Movement'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, limit, scale, Vector } from '../Math'
import { System } from './System'

export class MovementSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(Movement).forEach(id => {
            const movement = this.entities.getComponent(id, Movement)
            movement.state = this.updateVelocity(movement.state)
        })

        this.entities.withComponents(Transform, Movement, Control).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const movement = this.entities.getComponent(id, Movement)
            const control = this.entities.getComponent(id, Control)

            movement.state = this.updateControl(movement.state, control.state, transform.state)
        })
    }

    private updateVelocity(movementState: MovementState): MovementState {
        const { currVelocity, currAcceleration, maxSpeed, lastUpdated } = movementState

        const now = performance.now()
        const elapsedSec = (now - lastUpdated) * 0.001
        
        return {
            ...movementState, 
            currVelocity: limit(add(currVelocity, scale(currAcceleration, elapsedSec)), maxSpeed.toPxPerSec()),
            lastUpdated: now
        }
    }

    private updateControl(
            movementState: MovementState, 
            controlState: ControlState, 
            transformState: TransformState): MovementState {
        const { direction } = transformState
        const { acceleration, rotationalSpeed } = movementState
        const { isAccelerating, isDecelerating, isTurningLeft, isTurningRight } = controlState

        let newAcceleration: Vector
        if (isAccelerating) {
            newAcceleration = scale(direction, acceleration.toPxPerSec())
        } else if (isDecelerating) {
            newAcceleration = scale(direction, -acceleration.toPxPerSec())
        } else newAcceleration = [0, 0]

        let newRotationalSpeed: number
        if (isTurningLeft) {
            newRotationalSpeed = -rotationalSpeed.toRadPerSec()
        } else if (isTurningRight) {
            newRotationalSpeed = rotationalSpeed.toRadPerSec()
        } else newRotationalSpeed = 0

        return { 
            ...movementState, 
            currRotationalSpeed: newRotationalSpeed, 
            currAcceleration: newAcceleration
        }
    }
}
