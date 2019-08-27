import { Weapon } from '../components/Weapon';
import { EntityManager } from '../EntityManager';
import { System } from './System';

export class WeaponSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super();
    }
}
