import { Component } from '../components/Component';
import { Vector } from '../math/Vector';
import { System } from '../systems/System';
import { getPlayer } from './Assembly';
import { Entity } from './Entity';

export class Entities {
    entities: Entity[];
    private enumerator: number;

    constructor() {
        this.entities = [];
        this.enumerator = 0;
        this.create(getPlayer(new Vector(640, 360)));
    }

    proccess(systems: ReadonlyArray<System>) {
        systems.forEach(system => system.update());
    }

    get(entityId: number): Entity | undefined {
        return this.entities.find(entity => entity.id === entityId);
    }

    create(components: Component[]) {
        this.entities.push(new Entity(this.enumerator, components));
        this.enumerator++;
    }

    getAllComponents<T extends Component>(type: new (state: any) => T): T[] {
        return this.entities
            .map(entity => entity.getComponent(type))
            .filter((entity): entity is T => entity !== undefined);
    }

    getComponent<T extends Component>(entityId: number, type: new (state: any) => T): T | undefined {
        const entity = this.get(entityId);
        return entity && entity.getComponent(type);
    }
}
