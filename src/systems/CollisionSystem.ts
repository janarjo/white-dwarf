import { Collision, CollisionState } from '../components/Collision'
import { Polygon, ShapeType, Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, isIntersect, isWithinTriangle, overlap, Position, Rectangle, Triangle } from '../math/Math'
import { getAxes, getContactPoints, project } from '../math/SAT'
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

            const collisions = collideableEntities
                .filter(otherId => id !== otherId)
                .filter(otherId => {
                    const otherCollision = this.entities.getComponent(otherId, Collision)
                    if (!collision.state.mask.includes(otherCollision.state.group)) return false

                    const otherTransform = this.entities.getComponent(otherId, Transform)
                    const otherBoundingBox: Rectangle = this.getBoundingBox(otherTransform.state, otherCollision.state)

                    return isIntersect(thisBoundingBox, otherBoundingBox)
                })
                .map(otherId => {
                    const otherTransform = this.entities.getComponent(otherId, Transform)
                    const { currShape: thisCurrShape } = transform.state
                    const { currShape: otherCurrShape } = otherTransform.state

                    let contactPoints: Position[] = []
                    if (!thisCurrShape || !otherCurrShape) return { id: otherId, contactPoints }
                    if (thisCurrShape.type === ShapeType.POLYGON && otherCurrShape.type === ShapeType.CIRCLE) {
                        const isColliding = thisCurrShape.triangles.some(triangle => isWithinTriangle(otherTransform.state.position, triangle))
                        if (isColliding) contactPoints.push(otherTransform.state.position)
                    } else if (thisCurrShape.type === ShapeType.CIRCLE && otherCurrShape.type === ShapeType.POLYGON) {
                        const isColliding = otherCurrShape.triangles.some(triangle => isWithinTriangle(transform.state.position, triangle))
                        if (isColliding) contactPoints.push(transform.state.position)
                    } else if (thisCurrShape.type === ShapeType.POLYGON && otherCurrShape.type === ShapeType.POLYGON) {
                        contactPoints = this.getContactPoints(thisCurrShape, otherCurrShape)
                    }

                    return { id: otherId, contactPoints }
                })
                .filter(collision => collision.contactPoints.length > 0)
            collision.state.isColliding = collisions.length > 0
            collision.state.collisions = collisions
        })
    }

    private getBoundingBox(transformState: TransformState, collisionState: CollisionState): Rectangle {
        const pos = transformState.position
        const [offset, dimensions] = collisionState.boundingBox
        return [add(pos, offset), dimensions]
    }

    private getContactPoints(polygon1: Polygon, polygon2: Polygon) {
        const contactPoints: Position[] = []
        for (const triangle1 of polygon1.triangles) {
            for (const triangle2 of polygon2.triangles) {
                if (this.isColliding(triangle1, triangle2)) {
                    getContactPoints(triangle1, triangle2).forEach(contactPoint => {
                        contactPoints.push(contactPoint)
                    })
                }
            }
        }

        return contactPoints
    }

    private isColliding(triangle1: Triangle, triangle2: Triangle) {
        const axes = [...getAxes(triangle1), ...getAxes(triangle2)]

        for (const axis of axes) {
            const range1 = project(triangle1, axis)
            const range2 = project(triangle2, axis)

            // If the overlap is negative, the triangles are not colliding
            if (overlap(range1, range2) <= 0) {
                return false
            }
        }

        return true
    }

}
