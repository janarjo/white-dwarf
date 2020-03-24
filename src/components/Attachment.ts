import { Component, ComponentCode, ComponentState } from './Component'
import { SlotType } from './Hub'

export enum RemoveBehavior {
    DISCARD,
    DETACH,
}

export interface AttachmentState extends ComponentState {
    type: SlotType
    onRemove: RemoveBehavior
}

export class Attachment extends Component {
    constructor(public state: AttachmentState) {
        super(ComponentCode.ATTACHMENT, 'Attachment', state)
    }
}
