import { Entity } from '../Entity';
import { System } from './System';

export class WeaponSystem extends System {
    registerListeners(): void {
        throw new Error('Method not implemented.');
    }

    update(entities: Entity[]) {
        entities.forEach(() => {
            return;
        });
    }
}
