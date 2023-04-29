import { Collision, CollisionState } from '../components/Collision'
import { Render, ShapeType } from '../components/Render'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, earclip, getAxes, isIntersect, overlap, Polygon, project, Rectangle, Triangle } from '../Math'
import { System } from './System'

export class CollisionSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update() {
        const collideableEntities = this.entities.withComponents(Transform, Collision, Render)
        collideableEntities.forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const collision = this.entities.getComponent(id, Collision)
            const render = this.entities.getComponent(id, Render)
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
                    const otherRender = this.entities.getComponent(otherId, Render)
                    const otherTransform = this.entities.getComponent(otherId, Transform)
                    const { shape: thisShape } = render.state
                    const { shape: otherShape } = otherRender.state
                    
                    if (thisShape.type === ShapeType.DOT || otherShape.type === ShapeType.DOT) return true
                    if (thisShape.type !== ShapeType.POLYGON || otherShape.type !== ShapeType.POLYGON) return false

                    const thisPoly = thisShape.points.map(point => add(point, transform.state.position))
                    const otherPoly = otherShape.points.map(point => add(point, otherTransform.state.position))

                    return this.isColliding(thisPoly, otherPoly)
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

    private isColliding(poly1: Polygon, poly2: Polygon) {
        const triangles1 = earclip(poly1)
        const triangles2 = earclip(poly2)
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
