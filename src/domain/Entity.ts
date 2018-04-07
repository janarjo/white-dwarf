import { Vector } from '../math/Vector';

export abstract class Entity {
    constructor(
            public position: Vector,
            public orientation: number,
            protected speed: number) {
    }

    move() {
        const motionX = this.speed * Math.cos(this.orientation);
        const motionY = this.speed * Math.sin(this.orientation);
        this.position = this.position.add(new Vector(motionX, motionY));
    }
}
