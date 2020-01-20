import { Offset } from '../Math'
import { Component, ComponentCode } from './Component'

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
    attachmentId: number | undefined,
    offset: Offset,
}

export interface HubState {
    slots: Slot[]
}

export class Hub extends Component {
    constructor(public state: HubState) {
        super(ComponentCode.HUB, 'Hub', state)
    }
}
