import { Collision, CollisionState } from '../components/Collision'
import { ShapeType, Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, getAxes, isIntersect, isWithinTriangle, overlap, project, Rectangle, Triangle } from '../Math'
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

            const collidingEntities = collideableEntities
                .filter(otherId => id !== otherId)
                .filter(otherId => {
                    const otherCollision = this.entities.getComponent(otherId, Collision)
                    if (!collision.state.mask.includes(otherCollision.state.group)) return false
                    
                    const otherTransform = this.entities.getComponent(otherId, Transform)
                    const otherBoundingBox: Rectangle = this.getBoundingBox(otherTransform.state, otherCollision.state)

                    return isIntersect(thisBoundingBox, otherBoundingBox)
                })
                .filter(otherId => {
                    const otherTransform = this.entities.getComponent(otherId, Transform)
                    const { currShape: thisCurrShape } = transform.state
                    const { currShape: otherCurrShape } = otherTransform.state
                    
                    if (!thisCurrShape || !otherCurrShape) return false
                    if (thisCurrShape.type === ShapeType.POLYGON && otherCurrShape.type === ShapeType.DOT) {
                        return thisCurrShape.triangles.some(triangle => isWithinTriangle(otherTransform.state.position, triangle))
                    }
                    if (thisCurrShape.type === ShapeType.DOT && otherCurrShape.type === ShapeType.POLYGON) {
                        return otherCurrShape.triangles.some(triangle => isWithinTriangle(transform.state.position, triangle))
                    }
                    if (thisCurrShape.type === ShapeType.POLYGON && otherCurrShape.type === ShapeType.POLYGON) {
                        return this.isColliding(thisCurrShape.triangles, otherCurrShape.triangles)
                    }

                    return false
                })
            collision.state.isColliding = collidingEntities.length > 0
            collision.state.colliders = collidingEntities
        })
    }

    private getBoundingBox(transformState: TransformState, collisionState: CollisionState): Rectangle {
        const pos = transformState.position
        const [offset, dimensions] = collisionState.boundingBox
        return [add(pos, offset), dimensions]
    }

    private isColliding(triangles1: Triangle[], triangles2: Triangle[]) {
        for (const triangle1 of triangles1) {
            for (const triangle2 of triangles2) {
                if (this.isTrianglesColliding(triangle1, triangle2)) {
                    return true
                }
            }
        }
    }

    private isTrianglesColliding(triangle1: Triangle, triangle2: Triangle) {
        const axes = [...getAxes(triangle1), ...getAxes(triangle2)]
        for (const axis of axes) {
            const range1 = project(triangle1, axis)
            const range2 = project(triangle2, axis)
            if (!overlap(range1, range2)) {
                return false
            }
        }
        return true
    }
}
