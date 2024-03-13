import { Timings } from '../Clock'
import { EntityHub } from '../components/EntityHub'
import { Physics } from '../components/Physics'
import { ShapeType, Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, hvec, isWithinRectangle, rotate, rotatePolygon, scale, translate, Triangle, Vector } from '../Math'
import { System } from './System'

export class TransformSystem implements System {
    constructor(
        readonly entities: EntityManager,
        readonly mapSize: Vector) {
    }

    private readonly paddedMapSize = [[-100, -100], add(this.mapSize, [100, 100])] as const

    update(timings: Timings) {
        const { dft } = timings

        this.entities.withComponents(Transform, Physics).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const physics = this.entities.getComponent(id, Physics)

            const { position, direction } = transform.state
            const { currVelocity, currRotationalSpeed } = physics.state

            transform.state = {
                ...transform.state,
                position: add(position, scale(currVelocity, dft.toSec())),
                direction: rotate(direction, hvec(currRotationalSpeed * dft.toSec()))
            }
        })

        this.entities.withComponents(Transform, EntityHub).forEach((id) => {
            const transform = this.entities.getComponent(id, Transform)
            const { position, direction } = transform.state

            const hub = this.entities.getComponent(id, EntityHub)
            hub.state.slots.forEach(slot => {
                const { attachmentId, offset } = slot
                if (!attachmentId) return

                const attachmentTransform = this.entities.getComponentOrNone(attachmentId, Transform)
                if (!attachmentTransform) return

                attachmentTransform.state = {
                    ...attachmentTransform.state,
                    position: rotate(add(position, offset), direction, position),
                    direction: direction
                }
            })
        })

        // Must be the final step
        this.entities.withComponents(Transform).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { position, direction, shape } = transform.state

            switch (shape?.type) {
                case ShapeType.DOT:
                    transform.state.currShape = shape
                    break
                case ShapeType.POLYGON:
                    const currPoints = translate(rotatePolygon(shape.points, direction), position) as Vector[]
                    const currTriangles = shape.triangles
                        .map(triangle => rotatePolygon(triangle, transform.state.direction) as Triangle)
                        .map(triangle => translate(triangle, transform.state.position) as Triangle)
                    transform.state.currShape = { ...shape, points: currPoints, triangles: currTriangles }
                    break
            }
        })

        this.entities.withComponents(Transform).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            if (!isWithinRectangle(transform.state.position, this.paddedMapSize)) this.entities.remove(id)
        })
    }
}
