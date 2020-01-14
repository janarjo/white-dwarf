import { Attachment, RemoveBehavior } from '../components/Attachment'
import { Hub } from '../components/Hub'
import { EntityManager } from '../EntityManager'
import { isDefined } from '../Util'
import { System } from './System'

export class HubSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(Hub).forEach((id) => {
            const hub = this.entities.getComponent(id, Hub)

            hub.state.slots
                .filter(slot => slot.attachmentId && !this.entities.exists(slot.attachmentId))
                .forEach(slot => slot.attachmentId === undefined)

            if (!this.entities.exists(id)) {
                hub.state.slots
                    .map(slot => slot.attachmentId)
                    .filter(isDefined)
                    .filter(attachmentId => {
                        const attachment = this.entities.getComponent(attachmentId, Attachment)
                        return attachment.state.onRemove === RemoveBehavior.DISCARD
                    })
                    .forEach(attachmentId => this.entities.remove(attachmentId))
            }
        })
    }
}
