import { Vector } from '../math/Vector';
import { Entity } from './Entity';
import { Player } from './Player';
import { Tuple } from './Types';

export class Game {
    readonly size: Tuple = [1200, 720];
    readonly player: Player = new Player(new Vector(600, 360));
    entities: ReadonlyArray<Entity> = [this.player];
}
