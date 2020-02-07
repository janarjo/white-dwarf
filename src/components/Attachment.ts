import { Component, ComponentCode } from './Component'
import { SlotType } from './Hub'

export enum RemoveBehavior {
    DISCARD,
    DETACH,
}

export interface AttachmentState {
    type: SlotType
    onRemove: RemoveBehavior
}

export class Attachment extends Component {
    constructor(public state: AttachmentState) {
        super(ComponentCode.ATTACHMENT, 'Attachment')
    }
}
