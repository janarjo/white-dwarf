import { Commands } from './command/Commands';
import { Entities } from './entities/Entities';
import { Events } from './events/Events';
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

    readonly entities = new Entities();
    readonly events = new Events();
    readonly commands = new Commands();

    readonly systems: System[];

    constructor(canvas: HTMLCanvasElement, size: Vector) {
        this.systems = [
            new CoreSystem(this.entities, this.events),
            new MovementSystem(this.entities, this.events, this.commands),
            new ControlSystem(this.entities, this.commands, canvas),
            new RenderSystem(this.entities, canvas.getContext('2d')!, size),
            new WeaponSystem(this.entities, this.events, this.commands),
        ];
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval));
            this.commands.proccess();
            this.events.proccess();
            this.entities.proccess(this.systems);
        }
    }
}
