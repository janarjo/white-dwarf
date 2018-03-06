import { Vector } from '../math/Vector';

export abstract class Entity {
    constructor(
            protected position: Vector,
            protected orientation: number) {
    }

    abstract move(): void;

    get Position() {
        return this.position;
    }

    get Orientation() {
        return this.orientation;
    }
}
