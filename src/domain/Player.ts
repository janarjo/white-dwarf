import { Vector } from '../math/Vector';
import { Entity } from './Entity';
import { Projectile } from './Projectile';

export class Player extends Entity {
    constructor(
            position: Vector,
            orientation: number = 0,
            speed: number = 0,
            private acceleration: number = 0.1,
            private readonly maxSpeed: number = 6,
            private turningSpeed: number = 0.10,
            public attackSpeed: number = 1,
            private projectileSpeed: number = 10) {
        super(position, orientation, speed);
    }

    accelerate() {
        this.speed < this.maxSpeed ? this.speed += this.acceleration : this.speed = this.maxSpeed;
    }

    decelerate() {
        this.speed > 0 ? this.speed -= this.acceleration : this.speed = 0;
    }

    turnRight() {
        this.orientation += this.turningSpeed;
    }

    turnLeft() {
        this.orientation -= this.turningSpeed;
    }

    getProjectile(): Projectile {
        return new Projectile(this.position, this.orientation, this.projectileSpeed);
    }
}
