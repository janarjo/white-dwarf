import { projectile } from '../Assembly'
import { AI } from '../components/AI'
import { Control } from '../components/Control'
import { QuickSlot, QuickSlotState } from '../components/QuickSlot'
import { Transform, TransformState } from '../components/Transform'
import { Weapon, WeaponState } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { add, rotate } from '../Math'
import { SoundCode, SoundManager } from '../SoundManager'
import { hasActiveItem } from './QuickSlotSystem'
import { System } from './System'

export class WeaponSystem implements System {
    constructor(
        private readonly entities: EntityManager,
        private readonly sounds: SoundManager) {
    }

    update() {
        this.entities.withComponents(Transform, Control, Weapon).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            const weapon = this.entities.getComponent(id, Weapon)
            const quickSlot = this.entities.getComponentOrNone(id, QuickSlot)

            if (control.state.isFiring && this.canFire(weapon.state, quickSlot?.state)) {
                const transform = this.entities.getComponent(id, Transform)
                weapon.state = this.fire(weapon.state, transform.state, false)
            } else weapon.state.hasFired = false
        })

        this.entities.withComponents(Transform, AI, Weapon).forEach(id => {
            const control = this.entities.getComponent(id, AI)
            const weapon = this.entities.getComponent(id, Weapon)

            if (control.state.isFiring && this.canFire(weapon.state)) {
                const transform = this.entities.getComponent(id, Transform)
                weapon.state = this.fire(weapon.state, transform.state, true)
            } else weapon.state.hasFired = false
        })
    }

    private canFire(weaponState: WeaponState, quickSlotState?: QuickSlotState) {
        const { lastFiredMs: lastFired, cooldownMs: cooldown, ammoType, ammoConsumed } = weaponState

        const now = performance.now()
        const isCooledDown = now - lastFired >= cooldown
        if (!isCooledDown) return false
        if (quickSlotState && !hasActiveItem(quickSlotState, ammoType, ammoConsumed)) return false

        return true
    }

    private fire(weaponState: WeaponState, transformState: TransformState, isEnemy: boolean) {
        const { offset } = weaponState
        const { position, direction } = transformState

        const firePosition = rotate(add(position, offset), direction, position)
        this.entities.add(projectile(firePosition, direction, isEnemy))
        this.sounds.play(SoundCode.LASER)
        return { ...weaponState, lastFiredMs: performance.now(), hasFired: true }
    }
}
