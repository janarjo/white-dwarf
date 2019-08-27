import { player } from './Assembly';
import { Component } from './components/Component';
import { System } from './systems/System';

export class EntityManager {
    private entities: Map<number, Component[]>;
    private enumerator: number;

    constructor() {
        this.entities = new Map();
        this.enumerator = 0;
        this.create(player([640, 360]));
    }

    proccess(systems: ReadonlyArray<System>) {
        systems.forEach(system => system.update());
    }

    create(components: Component[]) {
        this.entities.set(this.enumerator, components);
        this.enumerator++;
    }

    get(id: number): ReadonlyArray<Component> {
        const found = this.entities.get(id);
        if (!found) throw new Error(`No such entity id: ${id}`);
        return found;
    }

    getComponent<T extends Component>(id: number, type: new (state: any) => T): T {
        const found = this.get(id).find(component => component instanceof type);
        if (!found) throw new Error(`No such component: ${type.name} for entity id: ${id}`);
        return found as T;
    }

    withComponents(...types: Array<new (state: any) => Component>): ReadonlyArray<number> {
        return Array.from(this.entities.entries())
            .filter(([, components]) => this.hasComponents(components, types))
            .map(([id, _]) => id);
    }

    private hasComponents(components: Component[], types: Array<new (state: any) => Component>): boolean {
        return types.every(type => this.hasComponent(components, type));
    }

    private hasComponent<T extends Component>(components: Component[], type: new (state: any) => T): boolean {
        return components.find(component => component instanceof type) !== undefined;
    }
}
