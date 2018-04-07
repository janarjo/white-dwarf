import { Vector } from '../math/Vector';
import { Entity } from './Entity';

export class Projectile extends Entity {
    constructor(
            position: Vector,
            orientation: number,
            speed: number) {
        super(position, orientation, speed);
    }
}
