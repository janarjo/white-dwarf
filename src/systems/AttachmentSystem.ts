import { Attachment, RemoveBehavior } from '../components/Attachment'
import { EntityManager } from '../EntityManager'
import { System } from './System'

export class AttachmentSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(Attachment).forEach((id) => {
            const attachmentComponent = this.entities.getComponent(id, Attachment)
            const attachments = attachmentComponent.state.attachments

            if (!this.entities.exists(id)) {
                attachments
                    .filter(attachment => attachment.onRemove === RemoveBehavior.REMOVE)
                    .map(attachment => attachment.childId)
                    .forEach(childId => this.entities.remove(childId))
            }

            const existingAttachments = attachments
                .filter(attachment => this.entities.exists(attachment.childId))
            attachmentComponent.state.attachments = existingAttachments
        })
    }
}
