import { Attachment, RemoveBehavior } from '../components/Attachment'
import { EntityHub } from '../components/EntityHub'
import { EntityManager } from '../EntityManager'
import { isDefined } from '../Util'
import { System } from './System'

export class EntityHubSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update() {
        this.entities.withComponents(EntityHub).forEach((parentId) => {
            const hub = this.entities.getComponent(parentId, EntityHub)
            const slots = hub.state.slots

            slots
                .filter(slot => slot.attachmentId && !this.entities.exists(slot.attachmentId))
                .forEach(slot => slot.attachmentId = undefined)

            if (!this.entities.exists(parentId)) {
                const filledSlots = slots
                    .map(slot => slot.attachmentId)
                    .filter(isDefined)

                filledSlots
                    .filter(attachmentId => {
                        const attachment = this.entities.getComponent(attachmentId, Attachment)
                        return attachment.state.onRemove === RemoveBehavior.DISCARD
                    })
                    .forEach(attachmentId => this.entities.remove(attachmentId))

                filledSlots
                    .filter(attachmentId => {
                        const attachment = this.entities.getComponent(attachmentId, Attachment)
                        return attachment.state.onRemove === RemoveBehavior.DETACH
                    })
                    .forEach(attachmentId => this.entities.detach(parentId, attachmentId))
            }
        })
    }
}
