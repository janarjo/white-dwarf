import { Command } from '../command/Command';
import { Commands } from '../command/Commands';
import { Control } from '../components/Control';
import { Entities } from '../entities/Entities';
import { System } from './System';

export class ControlSystem extends System {
    constructor(
        private readonly entities: Entities,
        private readonly commands: Commands,
        canvas: HTMLCanvasElement) {
        super();
        canvas.addEventListener('keydown', (event) => this.handleInput(event, true));
        canvas.addEventListener('keyup', (event) => this.handleInput(event, false));
    }

    update() {
        this.entities.entities.forEach(entity => {
            const control = entity.getComponent(Control);
            if (!control) return;
            if (control.state.isTurningLeft) this.commands.emit(Command.TURN_LEFT);
            if (control.state.isAccelerating) this.commands.emit(Command.ACCELERATE);
            if (control.state.isTurningRight) this.commands.emit(Command.TURN_RIGHT);
            if (control.state.isDecelerating) this.commands.emit(Command.DECELERATE);
            if (control.state.isFiring) this.commands.emit(Command.FIRE);
        });
    }

    handleInput(event: KeyboardEvent, isKeyDown: boolean) {
        this.entities.entities.forEach(entity => {
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
