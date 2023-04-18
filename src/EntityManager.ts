import { Attachment } from './components/Attachment'
import { Component, Entity, ComponentState } from './components/Component'
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

export class EntityManager {
    private entities: Map<number, Entity>
    private markedForRemoval: Set<number>
    private enumerator: number

    constructor() {
        this.entities = new Map()
        this.markedForRemoval = new Set()
        this.enumerator = 0
    }

    clean() {
        this.markedForRemoval.forEach(id => this.entities.delete(id))
        this.markedForRemoval.clear()
    }

    create(entity: Entity): number {
        const id = this.enumerator
        this.entities.set(id, entity)
        this.enumerator++
        return id
    }

    get(id: number): Entity {
        const found = this.entities.get(id)
        if (!found) throw new Error(`No such entity id: ${id}`)
        return found
    }

    remove(id: number) {
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

    addComponent(id: number, component?: Component) {
        if (!component) return
        const found = this.get(id)
        found.push(component)
    }

    removeComponent<T extends Component, Y extends ComponentState>(
            id: number,
            type: new (state: Y) => T): void {
        let found = this.get(id)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        found = found.filter(component => !(component instanceof type))
    }

    getComponent<T extends Component, Y extends ComponentState>(
            id: number,
            type: new (state: Y) => T): T {
        const found = this.getComponentOrNone(id, type)
        if (!found) throw new Error(`No such component: ${type.name} for entity id: ${id}`)
        return found
    }

    getComponentOrNone<T extends Component, Y extends ComponentState>(
            id: number,
            type: new (state: Y) => T): T | undefined {
        const found = this.get(id).find(component => component instanceof type)
        if (!found) return undefined
        return found as T
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    withComponents(...types: Array<new (state: any) => Component>): ReadonlyArray<number> {
        return Array.from(this.entities.entries())
            .filter(([id]) => !this.markedForRemoval.has(id))
            .filter(([, components]) => this.hasComponents(components, types))
            .map(([id,]) => id)
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
        return !this.markedForRemoval.has(id) && this.entities.has(id)
    }

    getDebugInfo(): DebugInfo {
        const playerId = this.withComponents(Control, EntityHub)[0]
        const playerPosition = this.getComponent(playerId, Transform).state.position
        const { currVelocity, currAcceleration } = this.getComponent(playerId, Physics).state
        const playerInventory = this.getComponent(playerId, Inventory).state.items
        const componentCount = Array.from(this.entities.values())
            .map(components => components.length)
            .reduce((sum, current) => sum + current)
        return {
            playerPosition,
            playerVelocity: mag(currVelocity),
            playerAcceleration: mag(currAcceleration),
            entityCount: this.entities.size,
            componentCount,
            playerInventory
        }
    }

    hasComponent<T extends Component, Y extends ComponentState>(
            id: number,
            type: new (state: Y) => T): boolean {
        return this.hasComponents(this.get(id), [type])
    }

    private hasComponents<T extends Component, Y extends ComponentState>(
            entity: Entity,
            types: Array<new (state: Y) => T>): boolean {
        return types.every(type => entity.find(component => component instanceof type) !== undefined)
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
