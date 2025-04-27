import { EntityManager } from '../../src/EntityManager'
import { Vector } from '../../src/math/Math'
import { COSMIC_SPEED_LIMIT, Speed, degPerSec, pxPerSec, pxPerSec2, sec } from '../../src/Units'
import { Collision } from '../../src/components/Collision'
import { Component } from '../../src/components/Component'
import { Physics } from '../../src/components/Physics'
import { PhysicsSystem } from '../../src/systems/PhysicsSystem'
import { collision } from '../TestUtil'

describe('PhysicsSystem update', () => {

    it('should update the velocity for a moving entity with no acceleration', () => {
        const entities = new EntityManager()
        const entityId = entities.add([physics([10, 10], [0, 0])])

        new PhysicsSystem(entities).update(sec(1))

        const updatedState = entities.getComponent(entityId, Physics).state
        expect(updatedState.currVelocity).toMatchVector([10, 10])
    })

    it('should update the velocity for a moving entity with acceleration', () => {
        const entities = new EntityManager()
        const entityId = entities.add([physics([10, 10], [1, 1])])

        new PhysicsSystem(entities).update(sec(1))

        const updatedState = entities.getComponent(entityId, Physics).state
        expect(updatedState.currVelocity).toMatchVector([11, 11])
    })

    it('should update the velocity for a moving entity with deceleration', () => {
        const entities = new EntityManager()
        const entityId = entities.add([physics([10, 10], [-1, -1])])

        new PhysicsSystem(entities).update(sec(1))

        const updatedState = entities.getComponent(entityId, Physics).state
        expect(updatedState.currVelocity).toMatchVector([9, 9])
    })

    it('should update the velocity without exceeding the max velocity for a moving entity with acceleration', () => {
        const entities = new EntityManager()
        const entityId = entities.add([physics([6, 6], [5, 5], pxPerSec(10))])

        new PhysicsSystem(entities).update(sec(1))

        const updatedState = entities.getComponent(entityId, Physics).state
        expect(updatedState.currVelocity).toMatchVector([7.071, 7.071])
    })

    it('should set velocity to zero when zero acceleration with less than minimum speed', () => {
        const entities = new EntityManager()
        const entityId = entities.add([physics([0.5, 0.5], [0, 0])])

        new PhysicsSystem(entities).update(sec(1))

        const updatedState = entities.getComponent(entityId, Physics).state
        expect(updatedState.currVelocity).toMatchVector([0, 0])
    })

    it('should set velocity to zero when opposite acceleration with less than minimum speed', () => {
        const entities = new EntityManager()
        const entityId = entities.add([physics([0.5, 0.5], [-5, -5])])

        new PhysicsSystem(entities).update(sec(1))

        const updatedState = entities.getComponent(entityId, Physics).state
        expect(updatedState.currVelocity).toMatchVector([0, 0])
    })

    const physics = (currVelocity: Vector, currAcceleration: Vector, maxVelocity: Speed = COSMIC_SPEED_LIMIT) => new Physics({
        currVelocity,
        currRotationalSpeed: 0,
        currAcceleration,
        acceleration: pxPerSec2(10),
        rotationalSpeed: degPerSec(180),
        maxVelocity,
        mass: 1
    })
})

describe('PhysicsSystem collision update', () => {

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

    const physics = (currVelocity: Vector, mass: number = 1) => new Physics({
        currVelocity,
        currRotationalSpeed: 0,
        currAcceleration: [0, 0],
        acceleration: pxPerSec2(10),
        rotationalSpeed: degPerSec(10),
        maxVelocity: COSMIC_SPEED_LIMIT,
        mass
    })

    const setupColliders = (entities: EntityManager, entity1: Component[], entity2: Component[]) => {
        const entity1Id = entities.add(entity1)
        const entity2Id = entities.add(entity2)
        entities.getComponent(entity1Id, Collision).state.collisions = [{ id: entity2Id, contactPoints: [[0, 0]] }]
        entities.getComponent(entity2Id, Collision).state.collisions = [{ id: entity1Id, contactPoints: [[0, 0]] }]
        return [entity1Id, entity2Id]
    }
})
