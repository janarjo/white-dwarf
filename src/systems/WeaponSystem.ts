import { projectile } from '../Assembly'
import { AI } from '../components/AI'
import { Control } from '../components/Control'
import { Inventory, InventoryState } from '../components/Inventory'
import { Transform, TransformState } from '../components/Transform'
import { Weapon, WeaponState } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { ItemCode } from '../Items'
import { add, rotate } from '../Math'
import { SoundCode, SoundManager } from '../SoundManager'
import { hasItem } from './InventorySystem'
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
            const inventory = this.entities.getComponentOrNone(id, Inventory)

            if (control.state.isFiring && this.canFire(weapon.state, inventory?.state)) {
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

    private canFire(weaponState: WeaponState, invState?: InventoryState) {
        const { lastFiredMs: lastFired, cooldownMs: cooldown } = weaponState
        
        const now = performance.now()
        const isCooledDown = now - lastFired >= cooldown
        if (!isCooledDown) return false
        if (invState && !hasItem(invState, ItemCode.AMMO_PLASMA_SMALL)) return false

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
