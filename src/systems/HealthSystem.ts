import { Effects } from '../assembly/Effects'
import { Collision } from '../components/Collision'
import { Health } from '../components/Health'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { SoundManager } from '../SoundManager'
import { System } from './System'

export class HealthSystem implements System {
    constructor(
        private readonly entities: EntityManager,
        private readonly sounds: SoundManager) {
    }

    update() {
        this.entities.withComponents(Health, Collision).forEach(id => {
            const health = this.entities.getComponent(id, Health)
            const collision = this.entities.getComponent(id, Collision)

            if (collision.state.isColliding) {
                health.state.health -= 25
            }
        })

        this.entities.withComponents(Transform, Health).forEach(id => {
            const { position, direction } = this.entities.getComponent(id, Transform).state
            const { health, deathEmitRef, deathSound } = this.entities.getComponent(id, Health).state

            if (health > 0) return

            this.entities.remove(id)

            if (deathSound) this.sounds.play(deathSound)
            if (deathEmitRef) this.entities.add(Effects[deathEmitRef](position, direction, 30))
        })
    }
}
