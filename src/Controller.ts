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
    nextFire: number = Date.now();

    isShooting = false;
    isAccelerating = false;
    isDecelerating = false;
    isTurningLeft = false;
    isTurningRight = false;

    readonly eventManager = new EventManager();
    readonly entityManager = new EntityManager();

    readonly systems: System[];

    constructor(
            readonly ctx: CanvasRenderingContext2D,
            readonly size: Vector) {
            this.systems = [
                new CoreSystem(this.entityManager, this.eventManager),
                new MovementSystem(this.entityManager, this.eventManager),
                // new ControlSystem(this.entityManager, this.eventManager),
                new RenderSystem(this.entityManager, this.eventManager, ctx, size),
                // new WeaponSystem(this.entityManager, this.eventManager),
            ];
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval));
            this.applyPlayerInput();
            this.eventManager.processEvents();
            this.entityManager.processEntities(this.systems);
        }
    }

    applyPlayerInput() {
        const now = Date.now();
        if (this.isShooting && this.nextFire < now) {
            // this.eventManager.queueEvent(new FireEvent());
        }
        if (this.isAccelerating) {
            // todo
        }
        if (this.isDecelerating) {
            // todo
        }
        if (this.isTurningLeft) {
            // this.eventManager.queueEvent(new TurnEvent({ direction: TurnEventDirection.LEFT }));
        }
        if (this.isTurningRight) {
            // this.eventManager.queueEvent(new TurnEvent({ direction: TurnEventDirection.RIGHT }));
        }
    }

    handleInput(event: KeyboardEvent, isKeyDown: boolean) {
        switch (event.keyCode) {
            case 32: {
                this.isShooting = isKeyDown ? true : false;
                break;
            }
            case 37: {
                this.isTurningLeft = isKeyDown ? true : false;
                break;
            }
            case 38: {
                this.isAccelerating = isKeyDown ? true : false;
                break;
            }
            case 39: {
                this.isTurningRight = isKeyDown ? true : false;
                break;
            }
            case 40: {
                this.isDecelerating = isKeyDown ? true : false;
                break;
            }
        }
    }
}
