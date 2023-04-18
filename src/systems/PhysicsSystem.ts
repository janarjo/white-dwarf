import { AI } from '../components/AI'
import { Collision } from '../components/Collision'
import { Control, ControlState } from '../components/Control'
import { Physics, PhysicsState } from '../components/Physics'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, dot, limit, mag, neg, norm, scale, subtract, Vector } from '../Math'
import { Time } from '../Units'
import { System } from './System'

const BRAKING_TRESHOLD = 5

export class PhysicsSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update(dt: Time) {
        this.entities.withComponents(Physics).forEach(id => {
            const physics = this.entities.getComponent(id, Physics)
            physics.state = this.updateVelocity(dt, physics.state)
        })

        this.entities.withComponents(Transform, Physics, Control).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const physics = this.entities.getComponent(id, Physics)
            const control = this.entities.getComponent(id, Control)

            physics.state = this.updateControl(physics.state, control.state, transform.state)
        })

        this.entities.withComponents(Transform, Physics, AI).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const physics = this.entities.getComponent(id, Physics)
            const ai = this.entities.getComponent(id, AI)

            physics.state = this.updateControl(physics.state, ai.state, transform.state)
        })

        this.entities.withComponents(Physics, Collision).forEach(id => {
            const physics = this.entities.getComponent(id, Physics)
            const collision = this.entities.getComponent(id, Collision)

            const { isColliding, colliders } = collision.state
    
            if (!isColliding) return
           
            const otherId = colliders.find(otherId => otherId !== id)
            if (!otherId) return
    
            const otherPhysics = this.entities.getComponentOrNone(otherId, Physics)
            if (!otherPhysics) return
            
            physics.state = this.updateCollision(dt, physics.state, otherPhysics.state)
        })
    }

    private updateVelocity(dt: Time, movementState: PhysicsState): PhysicsState {
        const { currVelocity, currAcceleration, maxSpeed } = movementState
        
        let newVelocity = limit(add(currVelocity, scale(currAcceleration, dt.toSec())), maxSpeed.toPxPerSec())
        if (mag(newVelocity) < BRAKING_TRESHOLD && mag(currVelocity) > BRAKING_TRESHOLD) {
            newVelocity = [0, 0]
        }

        return {
            ...movementState, 
            currVelocity: newVelocity
        }
    }

    private updateControl(
            physicsState: PhysicsState, 
            controlState: ControlState, 
            transformState: TransformState): PhysicsState {
        const { direction } = transformState
        const { acceleration, rotationalSpeed, currVelocity } = physicsState
        const { isAccelerating, isDecelerating, isTurningLeft, isTurningRight, isBraking } = controlState

        let newRotationalSpeed: number
        if (isTurningLeft) {
            newRotationalSpeed = -rotationalSpeed.toRadPerSec()
        } else if (isTurningRight) {
            newRotationalSpeed = rotationalSpeed.toRadPerSec()
        } else newRotationalSpeed = 0

        let newAcceleration: Vector
        if (isBraking && mag(currVelocity) > 0) {
            newAcceleration = scale(neg(norm(currVelocity)), acceleration.toPxPerSec())
        } else if (isAccelerating) {
            newAcceleration = scale(direction, acceleration.toPxPerSec())
        } else if (isDecelerating) {
            newAcceleration = scale(direction, -acceleration.toPxPerSec())
        } else newAcceleration = [0, 0]

        return { 
            ...physicsState, 
            currRotationalSpeed: newRotationalSpeed, 
            currAcceleration: newAcceleration
        }
    }

    private updateCollision(dt: Time, physicsState: PhysicsState, otherPhysicsState: PhysicsState): PhysicsState {
        const { currVelocity, mass } = physicsState
        const { currVelocity: otherVelocity, mass: otherMass } = otherPhysicsState

        const totalMass = mass + otherMass
        const relativeVelocity = subtract(currVelocity, otherVelocity)
        const collisionNormal = norm(relativeVelocity)
        const impulse = 2 * dot(relativeVelocity, collisionNormal) / totalMass
        const newVelocity = subtract(currVelocity, scale(collisionNormal, impulse * dt.toSec()))
        return {
            ...physicsState,
            currVelocity: newVelocity
        }
    }
}
