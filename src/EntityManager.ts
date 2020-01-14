import { Component } from './components/Component'
import { Hub } from './components/Hub'
import { System } from './systems/System'
import { isUndefined } from './Util'

export class EntityManager {
    private entities: Map<number, Component[]>
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

    create(components: Component[]): number {
        const id = this.enumerator
        this.entities.set(id, components)
        this.enumerator++
        return id
    }

    attach(parentId: number, attachmentId: number) {
        const hub = this.getComponentOrNone(parentId, Hub)
        if (!hub) return

        const emptySlot = hub.state.slots.find(slot => isUndefined(slot.attachmentId))
        if (!emptySlot) return

        emptySlot.attachmentId = attachmentId
    }

    get(id: number): ReadonlyArray<Component> {
        const found = this.entities.get(id)
        if (!found) throw new Error(`No such entity id: ${id}`)
        return found
    }

    remove(id: number) {
        this.markedForRemoval.add(id)
    }

    addComponent(id: number, component: Component) {
        const found = this.entities.get(id)
        if (!found) throw new Error(`No such entity id: ${id}`)
        found.push(component)
    }

    getComponent<T extends Component>(id: number, type: new (state: any) => T): T {
        const found = this.getComponentOrNone(id, type)
        if (!found) throw new Error(`No such component: ${type.name} for entity id: ${id}`)
        return found
    }

    getComponentOrNone<T extends Component>(id: number , type: new (state: any) => T): T | undefined {
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
            components: ReadonlyArray<Component>,
            types: Array<new (state: any) => Component>): boolean {
        return types.every(type => this.hasComponent(components, type))
    }

    private hasComponent<T extends Component>(
            components: ReadonlyArray<Component>,
            type: new (state: any) => T): boolean {
        return components.find(component => component instanceof type) !== undefined
    }
}

export interface DebugInfo {
    entityCount: number,
    componentCount: number,
}
