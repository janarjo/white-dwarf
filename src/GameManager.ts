import { asteroid, blaster, camera, player } from './Assembly'
import { EntityManager } from './EntityManager'

export class GameManager {
    private then: number = performance.now()
    private readonly entities: EntityManager

    constructor(entities: EntityManager) {
        this.entities = entities
    }

    generateAsteroids() {
        const now = performance.now()
        if (now - this.then > 1500) {
            this.then = now
            this.entities.create(asteroid([320, 150], Math.random() * Math.PI))
        }
    }

    initWorld() {
        const playerId = this.entities.create(player([640, 360]))

        const cameraId = this.entities.create(camera())
        this.entities.attach(playerId, cameraId)

        const blasterId = this.entities.create(blaster())
        this.entities.attach(playerId, blasterId)
    }
}
