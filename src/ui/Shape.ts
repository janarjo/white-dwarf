import { Vector } from '../math/Vector';

export enum ShapeType {
    CIRCLE,
    TRIANGLE,
    DOT,
    RECTANGLE,
}

export abstract class Shape {
    constructor(
            protected type: ShapeType,
            protected position: Vector,
            protected color: string) {
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}
