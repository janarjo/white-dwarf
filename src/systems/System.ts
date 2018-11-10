import { Entity } from '../Entity';
import { EntityManager } from '../EntityManager';
import { EventManager } from '../EventManager';

export abstract class System {
    constructor(
        readonly entityManager: EntityManager,
        readonly eventManager: EventManager) {
            this.registerListeners();
    }

    abstract update(entities: Entity[]): void;

    registerListeners(): void {
        return;
    }
}
