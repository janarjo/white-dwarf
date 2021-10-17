import { projectile } from '../Assembly'
import { AI } from '../components/AI'
import { Control } from '../components/Control'
import { Transform, TransformState } from '../components/Transform'
import { Weapon, WeaponState } from '../components/Weapon'
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
            const transform = this.entities.getComponent(id, Transform)
            
            weapon.state = this.updateFiring(weapon.state, transform.state, false)
        })

        this.entities.withComponents(Transform, AI, Weapon).forEach(id => {
            const control = this.entities.getComponent(id, AI)
            if (!control.state.isFiring) return

            const weapon = this.entities.getComponent(id, Weapon)
            const transform = this.entities.getComponent(id, Transform)
            
            weapon.state = this.updateFiring(weapon.state, transform.state, true)
        })
    }

    private updateFiring(weaponState: WeaponState, transformState: TransformState, isEnemy: boolean) {
        const { lastFiredMs: lastFired, cooldownMs: cooldown, offset } = weaponState
        const now = performance.now()
        const isCooledDown = now - lastFired >= cooldown
        if (!isCooledDown) return weaponState

        const { position, direction } = transformState

        const firePosition = rotate(add(position, offset), direction, position)
        this.entities.create(projectile(firePosition, direction, isEnemy))
        return { ...weaponState, lastFiredMs: now }
    }
}
