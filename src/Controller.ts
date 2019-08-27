import { EntityManager } from './EntityManager';
import { Vector } from './math/Vector';
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

    readonly entities = new EntityManager();

    readonly systems: System[];

    constructor(canvas: HTMLCanvasElement, size: Vector) {
        this.systems = [
            new TransformSystem(this.entities),
            new MovementSystem(this.entities),
            new ControlSystem(this.entities, canvas),
            new RenderSystem(this.entities, canvas.getContext('2d')!, size),
            new WeaponSystem(this.entities),
        ];
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval));
            this.entities.proccess(this.systems);
        }
    }
}
