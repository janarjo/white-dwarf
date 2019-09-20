import { EntityManager } from './EntityManager';
import { Vector } from './math/Vector';
import { CollisionSystem } from './systems/CollisionSystem';
import { ControlSystem } from './systems/ControlSystem';
import { MovementSystem } from './systems/MovementSystem';
import { RenderSystem } from './systems/RenderSystem';
import { System } from './systems/System';
import { TransformSystem } from './systems/TransformSystem';
import { WeaponSystem } from './systems/WeaponSystem';

export class Controller {
    readonly fps = 60;
    readonly interval = 1000 / this.fps;
    then: number = Date.now();

    readonly entities: EntityManager;

    readonly systems: System[];

    constructor(canvas: HTMLCanvasElement, mapSize: Vector) {
        this.entities = new EntityManager();
        this.systems = [
            new ControlSystem(this.entities, canvas),
            new MovementSystem(this.entities),
            new TransformSystem(this.entities, mapSize),
            new CollisionSystem(this.entities),
            new WeaponSystem(this.entities),
            new RenderSystem(this.entities, canvas.getContext('2d')!, mapSize),
        ];
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval));
            this.entities.proccess(this.systems);
            this.entities.clean();
        }
    }
}
