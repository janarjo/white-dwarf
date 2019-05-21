import { Component } from './components/Components';
import { Entity } from './Entity';
import { getPlayer } from './EntityAssembly';
import { Vector } from './math/Vector';
import { System } from './systems/System';

export class EntityManager {
    entities: Entity[];
    private enumerator: number;

    constructor() {
        this.entities = [];
        this.enumerator = 0;
        this.createEntity(getPlayer(new Vector(640, 360)));
    }

    processEntities(systems: ReadonlyArray<System>) {
        systems.forEach(system => system.update());
    }

    getEntity(entityId: number): Entity | undefined {
        return this.entities.find(entity => entity.id === entityId);
    }

    createEntity(components: Component[]) {
        this.entities.push(new Entity(this.enumerator, components));
        this.enumerator++;
    }
}
