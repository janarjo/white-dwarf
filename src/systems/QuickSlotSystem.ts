import { EntityManager } from '../EntityManager'
import { ItemCode } from '../Items'
import { isDefined } from '../Util'
import { Control } from '../components/Control'
import { EntityHub, SlotType } from '../components/EntityHub'
import { Inventory } from '../components/Inventory'
import { QuickSlot, QuickSlotState } from '../components/QuickSlot'
import { Weapon } from '../components/Weapon'
import { System } from './System'

export class QuickSlotSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update() {
        this.entities.withComponents(QuickSlot, EntityHub).forEach(id => {
            const quickSlot = this.entities.getComponent(id, QuickSlot)

            this.entities.getAttachments(id, SlotType.WEAPON)
                .map(attachmentId => this.entities.getComponent(attachmentId, Weapon))
                .map(weapon => weapon.state)
                .filter(weaponState => weaponState.hasFired)
                .forEach(weaponState => this.consumeActiveItem(quickSlot.state, weaponState.ammoType, weaponState.ammoConsumed))
        })

        this.entities.withComponents(QuickSlot, Inventory, Control).forEach(id => {
            const quickSlot = this.entities.getComponent(id, QuickSlot)
            const control = this.entities.getComponent(id, Control)

            const { currItem, items: quickItems } = quickSlot.state
            const { quickSlotIndex } = control.state
            if (quickSlotIndex < 0 || quickSlotIndex >= quickItems.length) return
            if (quickItems[quickSlotIndex] === currItem) return

            const item = quickItems[quickSlotIndex]
            if (!item) return

            quickSlot.state = {
                ...quickSlot.state,
                currItem: item
            }
        })

        this.entities.withComponents(QuickSlot).forEach(id => {
            const quickSlot = this.entities.getComponent(id, QuickSlot)
            quickSlot.state.items
                .filter(item => isDefined(item) && item.amount <= 0)
                .forEach(item => {
                    quickSlot.state.items[quickSlot.state.items.indexOf(item)] = undefined
                    if (quickSlot.state.currItem === item) quickSlot.state.currItem = undefined
                })
        })
    }

    private consumeActiveItem(quickSlotState: QuickSlotState, code: ItemCode, amount = 1) {
        const { currItem } = quickSlotState
        if (!currItem || currItem.code !== code) throw new Error(`No such item equipped: ${code}`)
        if (currItem.amount < amount) throw new Error(`Amount too high: ${code} (x${amount})`)

        const newAmount = currItem.amount - amount
        if (newAmount === 0) {
            currItem.amount = 0
        } else currItem.amount = newAmount
    }
}

export const hasActiveItem = (quickSlotState: QuickSlotState, code: ItemCode, amount = 1) => {
    if (!quickSlotState.currItem) return false
    const { code: activeCode, amount: activeAmount } = quickSlotState.currItem
    return activeCode === code && activeAmount >= amount
}
