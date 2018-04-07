import { Tuple } from '../domain/Types';

export class Vector {
    constructor(readonly x: number, readonly y: number) { }

    add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    scale(n: number): Vector {
        return new Vector(this.x * n, this.y * n);
    }

    isWithin(area: Tuple): boolean {
        return this.x >= 0 && this.x <= area[0]
            && this.y >= 0 && this.y <= area[1];
    }
}
