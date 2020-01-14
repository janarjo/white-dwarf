import { Component, ComponentCode } from './Component'

export enum RemoveBehavior {
    DISCARD,
    DETACH,
}

export interface AttachmentState {
    onRemove: RemoveBehavior,
}

export class Attachment extends Component {
    constructor(public state: AttachmentState) {
        super(ComponentCode.ATTACHMENT, 'Attachment', state)
    }
}
