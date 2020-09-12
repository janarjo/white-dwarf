import { Attachment } from './components/Attachment'
import { Component, Entity, ComponentState } from './components/Component'
import { Control } from './components/Control'
import { Hub, SlotType } from './components/Hub'
import { isDefined, isUndefined } from './Util'
import { Position } from './Math'
import { Transform } from './components/Transform'

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
        const hub = this.getComponentOrNone(parentId, Hub)
        if (!hub) return

        const attachment = this.getComponentOrNone(attachmentId, Attachment)
        if (!attachment) return

        const availableSlot = hub.state.slots
            .filter(slot => slot.type === attachment.state.type)
            .find(slot => isUndefined(slot.attachmentId))
        if (!availableSlot) return

        const control = this.getComponentOrNone(parentId, Control)
        if (control) this.addComponent(attachmentId, control)

        availableSlot.attachmentId = attachmentId
    }

    detach(parentId: number, attachmentId: number) {
        const hub = this.getComponentOrNone(parentId, Hub)
        if (!hub) return

        const attachment = this.getComponentOrNone(attachmentId, Attachment)
        if (!attachment) return

        const attachmentSlot = hub.state.slots
            .find(slot => slot.attachmentId === attachmentId)
        if (!attachmentSlot) return

        this.removeComponent(attachmentId, Control)

        attachmentSlot.attachmentId = undefined
    }

    addComponent(id: number, component: Component) {
        const found = this.get(id)
        found.push(component)
    }

    removeComponent<T extends Component, Y extends ComponentState>(
            id: number,
            type: new (state: Y) => T): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let found = this.get(id)
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

    getAttachments(id: number, type?: SlotType): ReadonlySet<number> {
        const hub = this.getComponentOrNone(id, Hub)
        if (!hub) return new Set()

        return new Set(hub.state.slots
            .filter(slot => isUndefined(type) || slot.type === type)
            .map(slot => slot.attachmentId)
            .filter(isDefined))
    }

    exists(id: number): boolean {
        return this.markedForRemoval.has(id) || this.entities.has(id)
    }

    getDebugInfo(): DebugInfo {
        const playerId = this.withComponents(Control, Hub)[0]
        const playerPosition = this.getComponent(playerId, Transform).state.position
        const componentCount = Array.from(this.entities.values())
            .map(components => components.length)
            .reduce((sum, current) => sum + current)
        return {
            playerPosition,
            entityCount: this.entities.size,
            componentCount,
        }
    }

    private hasComponents<T extends Component, Y extends ComponentState>(
            entity: Entity,
            types: Array<new (state: Y) => T>): boolean {
        return types.every(type => this.hasComponent(entity, type))
    }

    private hasComponent<T extends Component, Y extends ComponentState>(
            entity: Entity,
            type: new (state: Y) => T): boolean {
        return entity.find(component => component instanceof type) !== undefined
    }
}

export interface DebugInfo {
    playerPosition: Position
    entityCount: number
    componentCount: number
}
