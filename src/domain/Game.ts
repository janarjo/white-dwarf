import { Vector } from '../math/Vector';
import { Entity } from './Entity';
import { Player } from './Player';
import { Tuple } from './Types';

export class Game {
    readonly size: Tuple = [1280, 720];
    readonly player: Player = new Player(new Vector(600, 360));
    entities: Entity[] = [this.player];

    moveEntities() {
        this.entities.forEach((e) => e.move());
    }

    clearDeadEntities() {
        this.entities = this.entities.filter((e) => e.position.isWithin(this.size));
    }
}
