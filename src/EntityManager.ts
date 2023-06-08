import { Attachment } from './components/Attachment'
import { Control } from './components/Control'
import { EntityHub, SlotType } from './components/EntityHub'
import { isDefined, isUndefined } from './Util'
import { mag, Position } from './Math'
import { Transform } from './components/Transform'
import { AI } from './components/AI'
import { Item } from './Items'
import { Inventory } from './components/Inventory'
import { Camera } from './components/Camera'
import { Physics } from './components/Physics'
import { EntityBag } from './EntityBag'

export class EntityManager extends EntityBag {
    private markedForRemoval: Set<number>

    constructor() {
        super()
        this.markedForRemoval = new Set()
    }

    clean() {
        this.markedForRemoval.forEach(id => super.remove(id))
        this.markedForRemoval.clear()
    }

    override remove(id: number) {
        this.markedForRemoval.add(id)
    }

    attach(parentId: number, attachmentId: number) {
        const hub = this.getComponentOrNone(parentId, EntityHub)
        if (!hub) return

        const attachment = this.getComponentOrNone(attachmentId, Attachment)
        if (!attachment) return

        const availableSlot = hub.state.slots
            .filter(slot => slot.type === attachment.state.type)
            .find(slot => isUndefined(slot.attachmentId))
        if (!availableSlot) return

        this.addComponent(attachmentId, this.getComponentOrNone(parentId, Control))
        this.addComponent(attachmentId, this.getComponentOrNone(parentId, AI))
        this.addComponent(attachmentId, this.getComponentOrNone(parentId, Inventory))

        availableSlot.attachmentId = attachmentId
    }

    detach(parentId: number, attachmentId: number) {
        const hub = this.getComponentOrNone(parentId, EntityHub)
        if (!hub) return

        const attachment = this.getComponentOrNone(attachmentId, Attachment)
        if (!attachment) return

        const attachmentSlot = hub.state.slots
            .find(slot => slot.attachmentId === attachmentId)
        if (!attachmentSlot) return

        this.removeComponent(attachmentId, Control)
        this.removeComponent(attachmentId, AI)
        this.removeComponent(attachmentId, Inventory)

        attachmentSlot.attachmentId = undefined
    }

    getAttachments(id: number, type?: SlotType): ReadonlyArray<number> {
        const hub = this.getComponentOrNone(id, EntityHub)
        if (!hub) return []

        return hub.state.slots
            .filter(slot => isUndefined(type) || slot.type === type)
            .map(slot => slot.attachmentId)
            .filter(isDefined)
    }

    getCamera(): Camera {
        const cameras = this.withComponents(Camera)
            .map(id => this.getComponent(id, Camera))
        if (cameras.length > 1) throw Error('More than one camera found!')
        if (cameras.length === 0) throw Error('No camera found!')
        return cameras[0]
    }

    exists(id: number): boolean {
        return !this.markedForRemoval.has(id) && this.has(id)
    }

    getDebugInfo(): DebugInfo {
        const playerId = this.withComponents(Control, EntityHub)[0]
        const playerPosition = this.getComponent(playerId, Transform).state.position
        const { currVelocity, currAcceleration } = this.getComponent(playerId, Physics).state
        const playerInventory = this.getComponent(playerId, Inventory).state.items
        return {
            playerPosition,
            playerVelocity: mag(currVelocity),
            playerAcceleration: mag(currAcceleration),
            entityCount: this.getEntityCount(),
            componentCount: this.getComponentCount(),
            playerInventory
        }
    }
}

export interface DebugInfo {
    playerPosition: Position
    playerVelocity: number
    playerAcceleration: number
    entityCount: number
    componentCount: number
    playerInventory: Item[]
}
