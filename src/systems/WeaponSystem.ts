import { projectile } from '../Assembly'
import { Control } from '../components/Control'
import { Transform } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { add, rotate } from '../Math'
import { System } from './System'

export class WeaponSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(Transform, Control, Weapon).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            if (!control.state.isFiring) return

            const weapon = this.entities.getComponent(id, Weapon)
            const { lastFiredMs: lastFired, cooldownMs: cooldown, offset } = weapon.state
            const now = performance.now()
            const isCooledDown = now - lastFired >= cooldown
            if (!isCooledDown) return

            const transform = this.entities.getComponent(id, Transform)
            const { position, direction } = transform.state

            const firePosition = rotate(add(position, offset), direction, position)
            this.entities.create(projectile(firePosition, direction))
            weapon.state = { ...weapon.state, lastFiredMs: now }
        })
    }
}
