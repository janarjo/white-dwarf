import { projectile } from '../Assembly'
import { Control } from '../components/Control'
import { Transform } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
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
            const { lastFired, cooldown } = weapon.state
            const now = Date.now()
            const isCooledDown = now - lastFired >= cooldown
            if (!isCooledDown) return

            const transform = this.entities.getComponent(id, Transform)
            const { position, orientation } = transform.state
            this.entities.create(projectile(position, orientation))
            weapon.state = { ...weapon.state, lastFired: now }
        })
    }
}
