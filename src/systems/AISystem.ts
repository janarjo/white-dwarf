import { AI } from '../components/AI'
import { EntityManager } from '../EntityManager'
import { System } from './System'

export class AISystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(AI).forEach(id => {
            const ai = this.entities.getComponent(id, AI)
            const { pollingRate, lastPolled } = ai.state

            const now = performance.now()
            const elapsedMs = now - lastPolled

            if (elapsedMs <= pollingRate.toMs()) return

            ai.state = {
                ...ai.state,
                isTurningLeft: this.getRandBool(),
                isTurningRight: this.getRandBool(),
                isAccelerating: this.getRandBool(),
                isFiring: this.getRandBool(),
                lastPolled: now,
            }
        })
    }

    private getRandBool() {
        return Math.random() < 0.5
    }
}
