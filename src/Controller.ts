import { CommandManager } from './CommandManager';
import { EntityManager } from './EntityManager';
import { EventManager } from './EventManager';
import { Vector } from './math/Vector';
import { ControlSystem } from './systems/ControlSystem';
import { CoreSystem } from './systems/CoreSystem';
import { MovementSystem } from './systems/MovementSystem';
import { RenderSystem } from './systems/RenderSystem';
import { System } from './systems/System';
import { WeaponSystem } from './systems/WeaponSystem';

export class Controller {
    readonly fps = 60;
    readonly interval = 1000 / this.fps;
    then: number = Date.now();

    readonly entityManager = new EntityManager();
    readonly eventManager = new EventManager();
    readonly commandManager = new CommandManager();

    readonly systems: System[];

    constructor(canvas: HTMLCanvasElement, size: Vector) {
        this.systems = [
            new CoreSystem(this.entityManager, this.eventManager),
            new MovementSystem(this.entityManager, this.eventManager, this.commandManager),
            new ControlSystem(this.entityManager, this.commandManager, canvas),
            new RenderSystem(this.entityManager, canvas.getContext('2d')!, size),
            new WeaponSystem(this.entityManager, this.eventManager, this.commandManager),
        ];
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval));
            this.commandManager.processCommands();
            this.eventManager.processEvents();
            this.entityManager.processEntities(this.systems);
        }
    }
}
