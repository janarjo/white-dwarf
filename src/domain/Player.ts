import { Vector } from '../math/Vector';
import { Entity } from './Entity';

export class Player extends Entity {
    constructor(
            position: Vector,
            orientation: number = 0,
            private speed: number = 0,
            private acceleration: number = 0.1,
            private readonly maxSpeed: number = 6,
            private turningSpeed: number = 0.10) {
        super(position, orientation);
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

    move() {
        const motionX = this.speed * Math.cos(this.orientation);
        const motionY = this.speed * Math.sin(this.orientation);
        this.position = this.position.add(new Vector(motionX, motionY));
    }
}
