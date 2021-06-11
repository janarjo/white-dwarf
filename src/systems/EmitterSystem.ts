import { exhaust } from '../Assembly'
import { Emitter, TriggerType } from '../components/Emitter'
import { Movement } from '../components/Movement'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, mag, rotate, scale } from '../Math'
import { System } from './System'

export class EmitterSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(Transform, Movement, Emitter).forEach(id => {
            const emitter = this.entities.getComponent(id, Emitter)
            const { trigger, rateMs, lastEmittedMs, offset } = emitter.state

            if (trigger !== TriggerType.ACCELERATION) return
            
            const now = performance.now()
            if (now - lastEmittedMs < rateMs) return

            const movement = this.entities.getComponent(id, Movement)
            const { currAcceleration } = movement.state
            if (mag(currAcceleration) === 0) return

            const transform = this.entities.getComponent(id, Transform)
            const { position, direction } = transform.state
            
            const emitPosition = rotate(add(position, offset), direction, position)
            this.entities.create(exhaust(emitPosition, scale(direction, -1)))
            emitter.state = { ...emitter.state, lastEmittedMs: now }
        })
    }
}
