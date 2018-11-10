import { ComponentCode } from '../components/Components';
import { Control, ControlState } from '../components/Control';
import { Entity } from '../Entity';
import { System } from './System';

export class ControlSystem extends System {

    update(entities: Entity[]) {
        entities.forEach((entity) => {
            const control = entity.getComponent(ComponentCode.CONTROL) as Control | undefined;

            if (control) {
                // todo
            }
        });
    }

    registerListeners(): void {
        return;
    }

    handleInput(event: KeyboardEvent, isKeyDown: boolean): void {
        switch (event.keyCode) {
            case 32: {
                // this.isShooting = isKeyDown ? true : false;
                break;
            }
            case 37: {
                // this.isTurningLeft = isKeyDown ? true : false;
                break;
            }
            case 38: {
                // this.isAccelerating = isKeyDown ? true : false;
                break;
            }
            case 39: {
                // this.isTurningRight = isKeyDown ? true : false;
                break;
            }
            case 40: {
                // this.isDecelerating = isKeyDown ? true : false;
                break;
            }
        }
    }
}
