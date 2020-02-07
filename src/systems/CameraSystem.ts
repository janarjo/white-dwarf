import { Camera } from '../components/Camera'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { Dimensions, divide, subtract } from '../Math'
import { System } from './System'

export class CameraSystem extends System {
    constructor(
        private readonly entities: EntityManager,
        private readonly viewport: Dimensions,
        private readonly mapSize: Dimensions) {
        super()
    }

    update() {
        this.entities.withComponents(Transform, Camera).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const { position } = transform.state
            const camera = this.entities.getComponent(id, Camera)
            const origin = camera.state.origin

            const newOrigin = subtract(position, divide(this.viewport, 2))
            const isOutsideHorizontalViewPort = newOrigin[0] < 0 || (newOrigin[0] + this.viewport[0]) > this.mapSize[0]
            const isOutsideVerticalViewPort = newOrigin[1] < 0 || (newOrigin[1] + this.viewport[1]) > this.mapSize[1]

            if (isOutsideHorizontalViewPort && isOutsideVerticalViewPort) return
            else if (isOutsideHorizontalViewPort) camera.state.origin = [origin[0], newOrigin[1]]
            else if (isOutsideVerticalViewPort) camera.state.origin = [newOrigin[0], origin[1]]
            else camera.state.origin = newOrigin
        })
    }
}
