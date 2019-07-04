import { Command } from '../command/Command';
import { Commands } from '../command/Commands';
import { Control } from '../components/Control';
import { Movement, MovementState } from '../components/Movement';
import { Entities } from '../entities/Entities';
import { Events } from '../events/Events';
import { MoveEvent } from '../events/MoveEvent';
import { TurnEvent } from '../events/TurnEvent';
import { System } from './System';

export class MovementSystem extends System {
    constructor(
        private readonly entities: Entities,
        private readonly events: Events,
        private readonly commands: Commands) {
        super();
        this.registerListeners();
    }

    update() {
        this.entities.entities.forEach(entity => {
            const movement = entity.getComponent(Movement);
            if (!movement) return;

            movement.state = this.updateMomentum(movement.state);
            if (movement.state.speed === 0) return;
            this.events.emit(new MoveEvent(entity.id, { speed: movement.state.speed }));
        });
    }

    registerListeners() {
        this.commands.on(Command.ACCELERATE, () => {
            this.entities.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (movement) movement.state.acceleration = 0.1;
                });
        });
        this.commands.on(Command.DECELERATE, () => {
            this.entities.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (movement) movement.state.acceleration = -0.1;
                });
        });
        this.commands.on(Command.TURN_LEFT, () => {
            this.entities.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (!movement) return;
                    if (movement.state.turningSpeed === 0) return;
                    this.events.emit(
                        new TurnEvent(entity.id, { turningSpeed: -movement.state.turningSpeed }));
                });
        });
        this.commands.on(Command.TURN_RIGHT, () => {
            this.entities.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (!movement) return;
                    if (movement.state.turningSpeed === 0) return;
                    this.events.emit(
                        new TurnEvent(entity.id, { turningSpeed: movement.state.turningSpeed }));
                });
        });
    }

    private updateMomentum(movementState: MovementState): MovementState {
        const newSpeed = movementState.speed + movementState.acceleration;
        if (newSpeed > 0 && newSpeed < movementState.maxSpeed) {
            return { ...movementState, speed: newSpeed };
        } else if (newSpeed <= 0) {
            return { ...movementState, speed: 0 };
        } else if (newSpeed > movementState.maxSpeed) {
            return { ...movementState, speed: movementState.maxSpeed };
        } else {
            return movementState;
        }
    }
}
