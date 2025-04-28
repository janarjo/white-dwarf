import { Item } from '../Items'
import { Component, ComponentCode, ComponentState } from './Component'

export interface InventoryState extends ComponentState {
    items: Item[]
    maxSize: number
}

export class Inventory extends Component<InventoryState> {
    constructor(public state: InventoryState) {
        super(ComponentCode.INVENTORY, 'Inventory', state, true)
    }
}
