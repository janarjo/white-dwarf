import { Attachment } from './components/Attachment'
import { Component, Entity } from './components/Component'
import { Control } from './components/Control'
import { Hub, SlotType } from './components/Hub'
import { System } from './systems/System'
import { isDefined, isUndefined } from './Util'

export class EntityManager {
    private entities: Map<number, Entity>
    private markedForRemoval: Set<number>
    private enumerator: number

    constructor() {
        this.entities = new Map()
        this.markedForRemoval = new Set()
        this.enumerator = 0
    }

    proccess(systems: ReadonlyArray<System>) {
        systems.forEach(system => system.update())
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

    removeComponent<T extends Component>(id: number, type: new (state: any) => T): void {
        let found = this.get(id)
        found = found.filter(component => !(component instanceof type))
    }

    getComponent<T extends Component>(id: number, type: new (state: any) => T): T {
        const found = this.getComponentOrNone(id, type)
        if (!found) throw new Error(`No such component: ${type.name} for entity id: ${id}`)
        return found
    }

    getComponentOrNone<T extends Component>(id: number, type: new (state: any) => T): T | undefined {
        const found = this.get(id).find(component => component instanceof type)
        if (!found) return undefined
        return found as T
    }

    withComponents(...types: Array<new (state: any) => Component>): ReadonlyArray<number> {
        return Array.from(this.entities.entries())
            .filter(([id]) => !this.markedForRemoval.has(id))
            .filter(([, components]) => this.hasComponents(components, types))
            .map(([id, _]) => id)
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
        const componentCount = Array.from(this.entities.values())
            .map(components => components.length)
            .reduce((sum, current) => sum + current)
        return {
            entityCount: this.entities.size,
            componentCount,
        }
    }

    private hasComponents(
        entity: Entity,
        types: Array<new (state: any) => Component>): boolean {
        return types.every(type => this.hasComponent(entity, type))
    }

    private hasComponent<T extends Component>(
        entity: Entity,
        type: new (state: any) => T): boolean {
        return entity.find(component => component instanceof type) !== undefined
    }
}

export interface DebugInfo {
    entityCount: number,
    componentCount: number,
}
