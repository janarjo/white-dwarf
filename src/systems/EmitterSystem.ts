import { Effects } from '../assembly/Effects'
import { Emitter, EmissionType, ReactiveEmission } from '../components/Emitter'
import { Physics, PhysicsState } from '../components/Physics'
import { Transform, TransformState } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, mag, rotate, scale } from '../math/Math'
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
            const updatedEmissions = emitter.state.emissions
                .filter(emission => emission.type === EmissionType.REACTIVE)
                .map(emission => this.updateReactive(
                    emission as ReactiveEmission,
                    this.entities.getComponent(id, Transform).state,
                    this.entities.getComponent(id, Physics).state))
            emitter.state.emissions = updatedEmissions
        })
    }

    private updateReactive(
            emission: ReactiveEmission,
            transformState: TransformState,
            physicsState: PhysicsState): ReactiveEmission {
        const { rateMs, lastEmittedMs, offset, size, emitRef, emitSound } = emission

        const now = performance.now()
        if (now - lastEmittedMs < rateMs) return emission

        const { currAcceleration } = physicsState
        if (mag(currAcceleration) === 0) return emission

        const { position, direction } = transformState

        const emitPosition = rotate(add(position, offset), direction, position)
        this.entities.add(Effects[emitRef](emitPosition, scale(direction, -1), size))

        if (emitSound) this.sounds.play(emitSound)

        return { ...emission, lastEmittedMs: now }
    }
}
