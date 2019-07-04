import { CommandManager } from '../CommandManager';
import { Command } from '../Commands';
import { ComponentCode } from '../components/Components';
import { Control } from '../components/Control';
import { Movement, MovementState } from '../components/Movement';
import { EntityManager } from '../EntityManager';
import { EventManager } from '../EventManager';
import { MoveEvent } from '../events/MoveEvent';
import { TurnEvent } from '../events/TurnEvent';
import { System } from './System';

export class MovementSystem extends System {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly eventManager: EventManager,
        private readonly commandManager: CommandManager) {
        super();
        this.registerListeners();
    }

    update() {
        this.entityManager.entities.forEach(entity => {
            const movement = entity.getComponent(Movement);
            if (!movement) return;

            movement.state = this.updateMomentum(movement.state);
            if (movement.state.speed === 0) return;
            this.eventManager.emit(new MoveEvent(entity.id, { speed: movement.state.speed }));
        });
    }

    registerListeners() {
        this.commandManager.on(Command.ACCELERATE, () => {
            this.entityManager.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (movement) movement.state.acceleration = 0.1;
                });
        });
        this.commandManager.on(Command.DECELERATE, () => {
            this.entityManager.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (movement) movement.state.acceleration = -0.1;
                });
        });
        this.commandManager.on(Command.TURN_LEFT, () => {
            this.entityManager.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (!movement) return;
                    if (movement.state.turningSpeed === 0) return;
                    this.eventManager.emit(
                        new TurnEvent(entity.id, { turningSpeed: -movement.state.turningSpeed }));
                });
        });
        this.commandManager.on(Command.TURN_RIGHT, () => {
            this.entityManager.entities
                .filter(entity => entity.hasComponent(Control))
                .forEach(entity => {
                    const movement = entity.getComponent(Movement);
                    if (!movement) return;
                    if (movement.state.turningSpeed === 0) return;
                    this.eventManager.emit(
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
