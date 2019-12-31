import { Offset } from '../Math'
import { Component, ComponentCode } from './Component'

export enum RemoveBehavior {
    REMOVE,
    DETACH,
}

export interface AttachmentInfo {
    childId: number,
    offset: Offset,
    onRemove: RemoveBehavior
}

export interface AttachmentState {
    attachments: AttachmentInfo[]
}

export class Attachment extends Component {
    constructor(public state: AttachmentState) {
        super(ComponentCode.ATTACHMENT, 'Attachment', state)
    }
}
