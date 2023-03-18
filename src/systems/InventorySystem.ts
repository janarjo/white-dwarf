import { Inventory, InventoryState } from '../components/Inventory'
import { EntityHub, SlotType } from '../components/EntityHub'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { ItemCode } from '../Items'
import { isDefined } from '../Util'
import { System } from './System'

export class InventorySystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update() {
        this.entities.withComponents(Inventory, EntityHub).forEach(id => {
            const inventory = this.entities.getComponent(id, Inventory)
            
            this.entities.getAttachments(id, SlotType.WEAPON)
                .map(attachmentId => this.entities.getComponent(attachmentId, Weapon))
                .filter(weapon => weapon.state.hasFired)
                .forEach(() => this.removeItem(inventory.state, ItemCode.AMMO_PLASMA_SMALL))
        })
    }

    private getItem(invState: InventoryState, code: ItemCode) {
        return invState.items.find(item => item.code === code)
    }

    private removeItem(invState: InventoryState, code: ItemCode, amount = 1) {
        const item = this.getItem(invState, code)
        if (!item) throw new Error(`No such item in inventory: ${ItemCode}`)
        if (item.amount < amount) throw new Error(`Amount too high: ${ItemCode} (x${amount})`)
       
        const newAmount = item.amount - amount
        if (newAmount === 0) {
            invState.items.splice(invState.items.indexOf(item), 1)
        } else item.amount = newAmount
    }
}

export const hasItem = (invState: InventoryState, code: ItemCode, amount = 1) => 
    isDefined(invState.items.find(item => item.code === code && item.amount >= amount))
