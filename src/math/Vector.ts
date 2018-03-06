export class Vector {
    constructor(readonly x: number, readonly y: number) { }

    add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    scale(n: number) {
        return new Vector(this.x * n, this.y * n);
    }
}
