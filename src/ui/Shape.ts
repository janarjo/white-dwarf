import { Vector } from '../math/Vector';

export abstract class Shape {
    constructor(
            protected position: Vector,
            protected color: string) {
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}
