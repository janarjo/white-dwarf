import { Camera } from '../components/Camera'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { Dimensions, divide, subtract } from '../Math'
import { System } from './System'

export class CameraSystem implements System {
    constructor(
        private readonly entities: EntityManager,
        private readonly viewport: Dimensions,
        private readonly mapSize: Dimensions) {
    }

    update() {
        this.entities.withComponents(Transform, Camera).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { position } = transform.state

            const camera = this.entities.getComponent(id, Camera)
            const { zoom } = camera.state

            const zoomedViewport = divide(this.viewport, zoom)
            let newOrigin = subtract(position, divide(zoomedViewport, 2))
            if (newOrigin[0] < 0) newOrigin = [0, newOrigin[1]]
            if (newOrigin[1] < 0) newOrigin = [newOrigin[0], 0]
            if (newOrigin[0] + zoomedViewport[0] > this.mapSize[0]) newOrigin = [this.mapSize[0] - zoomedViewport[0], newOrigin[1]]
            if (newOrigin[1] + zoomedViewport[1] > this.mapSize[1]) newOrigin = [newOrigin[0], this.mapSize[1] - zoomedViewport[1]]

            camera.state.origin = newOrigin
        })
    }
}
