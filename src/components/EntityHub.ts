import { Offset } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export enum RemoveBehavior {
    DISCARD,
    DETACH,
}

export enum SlotType {
    CAMERA,
    WEAPON,
}

export interface Slot {
    type: SlotType
    attachmentId: number | undefined
    offset: Offset
}

export interface EntityHubState extends ComponentState {
    slots: Slot[]
}

export class EntityHub extends Component {
    constructor(public state: EntityHubState) {
        super(ComponentCode.HUB, 'Hub', state)
    }
}
