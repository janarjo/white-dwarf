import { Component, ComponentCode, ComponentState } from './Component'
import { SlotType } from './EntityHub'

export enum RemoveBehavior {
    DISCARD,
    DETACH,
}

export interface AttachmentState extends ComponentState {
    type: SlotType
    onRemove: RemoveBehavior
}

export class Attachment extends Component<AttachmentState> {
    constructor(public state: AttachmentState) {
        super(ComponentCode.ATTACHMENT, 'Attachment', state)
    }
}
