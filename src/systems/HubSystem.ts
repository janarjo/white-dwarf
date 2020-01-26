import { Attachment, RemoveBehavior } from '../components/Attachment'
import { Control } from '../components/Control'
import { Hub, Slot } from '../components/Hub'
import { EntityManager } from '../EntityManager'
import { isDefined } from '../Util'
import { System } from './System'

export class HubSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(Hub).forEach((parentId) => {
            const hub = this.entities.getComponent(parentId, Hub)
            const slots = hub.state.slots

            slots
                .filter(slot => slot.attachmentId && !this.entities.exists(slot.attachmentId))
                .forEach(slot => slot.attachmentId === undefined)

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
