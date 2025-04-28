import { Item } from '../Items'
import { Component, ComponentCode, ComponentState } from './Component'

export interface QuickSlotState extends ComponentState {
    currItem?: Item
    items: (Item | undefined)[]
}

export class QuickSlot extends Component<QuickSlotState> {
    constructor(public state: QuickSlotState) {
        super(ComponentCode.QUICK_SLOT, 'Quick slot', state, true)
    }
}
