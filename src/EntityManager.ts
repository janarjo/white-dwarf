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
        this.createPlayer();
    }

    processEntities(systems: ReadonlyArray<System>) {
        systems.forEach((system) => system.update());
    }

    getEntity(entityId: number): Entity | undefined {
        return this.entities.find((entity) => entity.id === entityId);
    }

    createPlayer() {
        this.entities.push(new Entity(this.enumerator, getPlayer(new Vector(640, 360))));
        this.enumerator++;
    }
}
