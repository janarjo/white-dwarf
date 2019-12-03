import { planetoid } from './Assembly'
import { EntityManager } from './EntityManager'

export class Generator {
    private then: number = Date.now()
    private readonly entities: EntityManager

    constructor(entities: EntityManager) {
        this.entities = entities
    }

    generateAsteroids() {
        const now = Date.now()
        if (now - this.then > 1500) {
            this.then = now
            this.entities.create(planetoid([320, 150], Math.random() * Math.PI))
        }
    }
}
