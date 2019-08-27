import { Control, ControlState } from '../components/Control';
import { Movement, MovementState } from '../components/Movement';
import { EntityManager } from '../EntityManager';
import { System } from './System';

export class MovementSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super();
    }

    update() {
        this.entities.withComponents(Movement).forEach(id => {
            const movement = this.entities.getComponent(id, Movement);
            movement.state = this.updateMomentum(movement.state);
        });

        this.entities.withComponents(Movement, Control).forEach(id => {
            const movement = this.entities.getComponent(id, Movement);
            const control = this.entities.getComponent(id, Control);

            movement.state = this.updateControl(movement.state, control.state);
        });
    }

    private updateMomentum(movementState: MovementState): MovementState {
        const newSpeed = movementState.currSpeed + movementState.currAcceleration;
        if (newSpeed > 0 && newSpeed < movementState.maxSpeed) {
            return { ...movementState, currSpeed: newSpeed };
        } else if (newSpeed <= 0) {
            return { ...movementState, currSpeed: 0 };
        } else if (newSpeed > movementState.maxSpeed) {
            return { ...movementState, currSpeed: movementState.maxSpeed };
        } else return movementState;
    }

    private updateControl(movementState: MovementState, controlState: ControlState): MovementState {
        let newAcceleration: number;
        if (controlState.isAccelerating) {
            newAcceleration = movementState.acceleration;
        } else if (controlState.isDecelerating) {
            newAcceleration = -movementState.acceleration;
        } else newAcceleration = 0;

        let newRotationalSpeed: number;
        if (controlState.isTurningLeft) {
            newRotationalSpeed = -movementState.rotationalSpeed;
        } else if (controlState.isTurningRight) {
            newRotationalSpeed = movementState.rotationalSpeed;
        } else newRotationalSpeed = 0;

        return { ...movementState, currAcceleration: newAcceleration, currRotationalSpeed: newRotationalSpeed };
    }
}
