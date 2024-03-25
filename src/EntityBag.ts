import { Component, ComponentCode, ComponentState, Entity } from './components/Component'
import { intersect } from './Math'
import { isDefined } from './Util'

export class EntityBag {
    private entities: Map<number, Entity>
    private components: Map<ComponentCode, Set<number>>
    private enumerator: number

    constructor() {
        this.entities = new Map()
        this.components = new Map()
        this.enumerator = 1
    }

    has(id: number): boolean {
        return this.entities.has(id)
    }

    get(id: number): Entity {
        const found = this.entities.get(id)
        if (!found) throw new Error(`No such entity id: ${id}`)
        return found
    }

    add(entity: Entity): number {
        const id = this.enumerator
        this.entities.set(id, entity)
        entity.forEach(component => this.addToComponentBag(component, id))
        this.enumerator++
        return id
    }

    addComponent(id: number, component?: Component) {
        if (!component) return
        this.get(id).push(component)
        this.addToComponentBag(component, id)
    }

    removeComponent( id: number, component?: Component): void {
        if (!component) return
        this.entities.set(id, this.get(id).filter(component => component !== component))
        this.removeFromComponentBag(component, id)
    }

    remove(id: number) {
        this.entities.delete(id)
        this.components.forEach(ids => ids.delete(id))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    withComponents(...types: Array<new (state: any) => Component>): ReadonlyArray<number> {
        const componentBags = types
            .map(type => new type({}).code)
            .map(code => this.components.get(code) ?? new Set<number>())
        if (componentBags.length === 0) return []
        return Array.from(componentBags.reduce(intersect))
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

    hasComponent<T extends Component, Y extends ComponentState>
    (id: number, type: new (state: Y) => T): boolean {
        return isDefined(this.getComponentOrNone(id, type))
    }

    hasComponents<T extends Component, Y extends ComponentState>(
            id: number,
            types: Array<new (state: Y) => T>): boolean {
        return types.every(type => this.hasComponent(id, type))
    }

    getEntityCount(): number {
        return this.entities.size
    }

    getComponentCount(): number {
        return Array.from(this.components.values())
            .map(set => set.size)
            .reduce((acc, curr) => acc + curr, 0)
    }

    private addToComponentBag(component: Component, id: number) {
        const componentBag = this.components.get(component.code)
        if (!componentBag) {
            this.components.set(component.code, new Set([id]))
            return
        }
        componentBag.add(id)
    }

    private removeFromComponentBag(component: Component, id: number) {
        const componentBag = this.components.get(component.code)
        if (!componentBag) return
        componentBag.delete(id)
    }
}
