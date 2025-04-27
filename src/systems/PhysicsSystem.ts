import { AI } from '../components/AI'
import { Collision } from '../components/Collision'
import { Control, ControlState } from '../components/Control'
import { Physics, PhysicsState } from '../components/Physics'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, dot, limit, mag, neg, norm, scale, Vector } from '../math/Math'
import { Time } from '../Units'
import { arraysEqual } from '../Util'
import { System } from './System'

export const MIN_SPEED = 1

export class PhysicsSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update(dt: Time) {
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

        this.entities.withComponents(Physics).forEach(id => {
            const physics = this.entities.getComponent(id, Physics)
            physics.state = this.updateVelocity(dt, physics.state)
        })

        const colliderPairs = [] as Array<[number, number]>
        this.entities.withComponents(Physics, Collision)
            .map(id => [id, ...this.entities.getComponent(id, Collision).state.collisions.map(collision => collision.id)])
            .filter(collisions => collisions.length > 1)
            .map(colliders => colliders.slice(0, 2) as [number, number]) // Only handle collisions between two entities
            .map(colliders => colliders.sort()) // Sort to avoid duplicates
            .forEach(colliders => {
                const existingIndex = colliderPairs.findIndex(pair => arraysEqual(pair, colliders))
                if (existingIndex === -1) colliderPairs.push(colliders) // Only handle each collision once
            })
        for (const [thisId, otherId] of colliderPairs) {
            if (!this.entities.exists(thisId) || !this.entities.exists(otherId)) return

            const thisPhysics = this.entities.getComponentOrNone(thisId, Physics)
            const otherPhysics = this.entities.getComponentOrNone(otherId, Physics)
            if (!thisPhysics || !otherPhysics) return

            const updatedThisPhysics = this.updateCollision(dt, thisPhysics.state, otherPhysics.state)
            const updatedOtherPhysics = this.updateCollision(dt, otherPhysics.state, thisPhysics.state)

            thisPhysics.state = updatedThisPhysics
            otherPhysics.state = updatedOtherPhysics
        }
    }

    private updateVelocity(dt: Time, movementState: PhysicsState): PhysicsState {
        const { currVelocity, currAcceleration, maxVelocity: maxSpeed } = movementState

        const currSpeed = mag(currVelocity)
        const isZeroAccelerationWithLowSpeed = mag(currAcceleration) === 0 && currSpeed < MIN_SPEED
        const isOppositeAccelerationWithLowSpeed = dot(currVelocity, currAcceleration) < 0 && currSpeed < MIN_SPEED

        let newVelocity: Vector
        if (isZeroAccelerationWithLowSpeed || isOppositeAccelerationWithLowSpeed) newVelocity = [0, 0]
        else newVelocity = limit(add(currVelocity, scale(currAcceleration, dt.toSec())), maxSpeed.toPxPerSec())

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
        if (isBraking && mag(currVelocity) >= MIN_SPEED) {
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
        const newVelocity = add(
            scale(currVelocity, (mass - otherMass) / totalMass),
            scale(otherVelocity, (2 * otherMass) / totalMass))
        return {
            ...physicsState,
            currVelocity: newVelocity
        }
    }
}
