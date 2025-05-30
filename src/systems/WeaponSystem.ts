import { Projectiles } from '../assembly/Projectiles'
import { AI } from '../components/AI'
import { Control } from '../components/Control'
import { Physics, PhysicsState } from '../components/Physics'
import { QuickSlot, QuickSlotState } from '../components/QuickSlot'
import { Transform, TransformState } from '../components/Transform'
import { Weapon, WeaponState } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { add, rotate } from '../math/Math'
import { SoundManager } from '../SoundManager'
import { hasActiveItem } from './QuickSlotSystem'
import { System } from './System'

export class WeaponSystem implements System {
    constructor(
        private readonly entities: EntityManager,
        private readonly sounds: SoundManager) {
    }

    update() {
        this.entities.withComponents(Transform, Physics, Control, Weapon).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            const weapon = this.entities.getComponent(id, Weapon)
            const physics = this.entities.getComponent(id, Physics)
            const quickSlot = this.entities.getComponentOrNone(id, QuickSlot)

            if (control.state.isFiring && this.canFire(weapon.state, quickSlot?.state)) {
                const transform = this.entities.getComponent(id, Transform)
                weapon.state = this.fire(weapon.state, transform.state, physics.state, false)
            } else weapon.state.hasFired = false
        })

        this.entities.withComponents(Transform, Physics, AI, Weapon).forEach(id => {
            const control = this.entities.getComponent(id, AI)
            const weapon = this.entities.getComponent(id, Weapon)
            const physics = this.entities.getComponent(id, Physics)

            if (control.state.isFiring && this.canFire(weapon.state)) {
                const transform = this.entities.getComponent(id, Transform)
                weapon.state = this.fire(weapon.state, transform.state, physics.state, true)
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

    private fire(
            weaponState: WeaponState,
            transformState: TransformState,
            physicsState: PhysicsState,
            isEnemy: boolean) {
        const { offset, fireSound, projectileRef } = weaponState
        const { position, direction } = transformState
        const { currVelocity } = physicsState

        const firePosition = rotate(add(position, offset), direction, position)
        this.entities.add(Projectiles[projectileRef](firePosition, direction, currVelocity, isEnemy))
        if (fireSound) this.sounds.play(fireSound)

        return { ...weaponState, lastFiredMs: performance.now(), hasFired: true }
    }
}
