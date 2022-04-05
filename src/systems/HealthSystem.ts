import { Collision } from '../components/Collision'
import { Health } from '../components/Health'
import { EntityManager } from '../EntityManager'
import { System } from './System'

export class HealthSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update() {
        this.entities.withComponents(Health, Collision).forEach(id => {
            const health = this.entities.getComponent(id, Health)
            if (health.state.health <= 0) this.entities.remove(id)

            const collision = this.entities.getComponent(id, Collision)
            if (collision.state.isColliding) {
                health.state.health -= 25
            }
        })

        this.entities.withComponents(Health).forEach(id => {
            const health = this.entities.getComponent(id, Health)
            if (health.state.health <= 0) this.entities.remove(id)
        })
    }
}
