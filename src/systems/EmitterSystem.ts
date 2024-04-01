import { exhaust } from '../Assembly'
import { Emitter, TriggerType } from '../components/Emitter'
import { Physics } from '../components/Physics'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, mag, rotate, scale } from '../Math'
import { SoundManager } from '../SoundManager'
import { System } from './System'

export class EmitterSystem implements System {
    constructor(
        private readonly entities: EntityManager,
        private readonly sounds: SoundManager) {
    }

    update() {
        this.entities.withComponents(Transform, Physics, Emitter).forEach(id => {
            const emitter = this.entities.getComponent(id, Emitter)
            const { trigger, rateMs, lastEmittedMs, offset, size, emitSound } = emitter.state

            if (trigger !== TriggerType.ACCELERATION) return

            const now = performance.now()
            if (now - lastEmittedMs < rateMs) return

            const physics = this.entities.getComponent(id, Physics)
            const { currAcceleration } = physics.state
            if (mag(currAcceleration) === 0) return

            const transform = this.entities.getComponent(id, Transform)
            const { position, direction } = transform.state

            const emitPosition = rotate(add(position, offset), direction, position)
            this.entities.add(exhaust(emitPosition, scale(direction, -1), size))
            if (emitSound) this.sounds.play(emitSound)
            emitter.state = { ...emitter.state, lastEmittedMs: now }
        })
    }
}
