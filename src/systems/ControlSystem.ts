import { CommandManager } from '../CommandManager';
import { Command } from '../Commands';
import { ComponentCode } from '../components/Components';
import { Control } from '../components/Control';
import { EntityManager } from '../EntityManager';
import { System } from './System';

export class ControlSystem extends System {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly commandManager: CommandManager,
        canvas: HTMLCanvasElement) {
        super();
        canvas.addEventListener('keydown', (event) => this.handleInput(event, true));
        canvas.addEventListener('keyup', (event) => this.handleInput(event, false));
    }

    update() {
        this.entityManager.entities.forEach((entity) => {
            const control = entity.getComponent(Control);
            if (!control) return;
            if (control.state.isTurningLeft) this.commandManager.queueCommand(Command.TURN_LEFT);
            if (control.state.isAccelerating) this.commandManager.queueCommand(Command.ACCELERATE);
            if (control.state.isTurningRight) this.commandManager.queueCommand(Command.TURN_RIGHT);
            if (control.state.isDecelerating) this.commandManager.queueCommand(Command.DECELERATE);
            if (control.state.isFiring) this.commandManager.queueCommand(Command.FIRE);
        });
    }

    handleInput(event: KeyboardEvent, isKeyDown: boolean) {
        this.entityManager.entities.forEach((entity) => {
            const control = entity.getComponent(Control);
            if (!control) return;
            switch (event.keyCode) {
                case 32: {
                    control.state.isFiring = isKeyDown ? true : false;
                    break;
                }
                case 37: {
                    control.state.isTurningLeft = isKeyDown ? true : false;
                    break;
                }
                case 38: {
                    control.state.isAccelerating = isKeyDown ? true : false;
                    break;
                }
                case 39: {
                    control.state.isTurningRight = isKeyDown ? true : false;
                    break;
                }
                case 40: {
                    control.state.isDecelerating = isKeyDown ? true : false;
                    break;
                }
            }
        });
    }
}
