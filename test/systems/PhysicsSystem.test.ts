import { EntityManager } from '../../src/EntityManager'
import { sec } from '../../src/Units'
import { Collision } from '../../src/components/Collision'
import { Component } from '../../src/components/Component'
import { Physics } from '../../src/components/Physics'
import { PhysicsSystem } from '../../src/systems/PhysicsSystem'
import { collision, physics } from '../TestUtil'

describe('PhysicsSystem', () => {

    it('should update the velocities for a collision between stationary and moving entity', () => {
        const entities = new EntityManager()
        const thisCollider = [physics([1, 1], 1), collision(true)]
        const otherCollider = [physics([0, 0], 1), collision(true)]
        const colliderIds = setupColliders(entities, thisCollider, otherCollider)

        new PhysicsSystem(entities).update(sec(1))

        const thisUpdatedState = entities.getComponent(colliderIds[0], Physics).state
        expect(thisUpdatedState.currVelocity).toMatchVector([0, 0])

        const otherUpdatedState = entities.getComponent(colliderIds[1], Physics).state
        expect(otherUpdatedState.currVelocity).toMatchVector([1, 1])
    })

    it('should update the velocities for a collision between two moving entities', () => {
        const entities = new EntityManager()
        const thisCollider = [physics([1, 1], 1), collision(true)]
        const otherCollider = [physics([-1, -1], 1), collision(true)]
        const colliderIds = setupColliders(entities, thisCollider, otherCollider)

        new PhysicsSystem(entities).update(sec(1))

        const thisUpdatedState = entities.getComponent(colliderIds[0], Physics).state
        expect(thisUpdatedState.currVelocity).toMatchVector([-1, -1])

        const otherUpdatedState = entities.getComponent(colliderIds[1], Physics).state
        expect(otherUpdatedState.currVelocity).toMatchVector([1, 1])
    })

    it('should update the velocities for a collision between two moving entities with different masses', () => {
        const entities = new EntityManager()
        const thisCollider = [physics([1, 1], 1), collision(true)]
        const otherCollider = [physics([-1, -1], 2), collision(true)]
        const colliderIds = setupColliders(entities, thisCollider, otherCollider)

        new PhysicsSystem(entities).update(sec(1))

        const thisUpdatedState = entities.getComponent(colliderIds[0], Physics).state
        expect(thisUpdatedState.currVelocity).toMatchVector([-1.667, -1.667])

        const otherUpdatedState = entities.getComponent(colliderIds[1], Physics).state
        expect(otherUpdatedState.currVelocity).toMatchVector([0.333, 0.333])
    })

    const setupColliders = (entities: EntityManager, entity1: Component[], entity2: Component[]) => {
        const entity1Id = entities.add(entity1)
        const entity2Id = entities.add(entity2)
        entities.getComponent(entity1Id, Collision).state.colliders = [entity1Id, entity2Id]
        entities.getComponent(entity2Id, Collision).state.colliders = [entity1Id, entity2Id]
        return [entity1Id, entity2Id]
    }
})
