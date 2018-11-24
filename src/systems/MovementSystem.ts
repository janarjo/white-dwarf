import { ComponentCode } from '../components/Components';
import { Movement, MovementState } from '../components/Movement';
import { EntityManager } from '../EntityManager';
import { EventManager } from '../EventManager';
import { AccelerateEvent } from '../events/AccelerateEvent';
import { Event, EventType } from '../events/Event';
import { System } from './System';

export class MovementSystem extends System {
    constructor(
        readonly entityManager: EntityManager,
        readonly eventManager: EventManager) {
            super(entityManager, eventManager);
    }

    update() {
        this.entityManager.entities.forEach((entity) => {
            const movement = entity.getComponent(ComponentCode.MOVEMENT) as Movement | undefined;
            if (movement) {
                movement.state = this.updateMomentum(movement.state);
            }
        });
    }

    registerListeners() {
        this.eventManager.registerListener(EventType.ACCELERATE, (event: Event) => {
            const entity = this.entityManager.getEntity(event.entityId);
            const movement = entity && entity.getComponent(ComponentCode.MOVEMENT) as Movement | undefined;
            if (movement) {
                const accelerateEvent = (event as AccelerateEvent);
                movement.state = this.updateAcceleration(movement.state, accelerateEvent.data.amount);
            }
        });
    }

    private updateAcceleration(movementState: MovementState, amount: number): MovementState {
        return { ...movementState, acceleration: movementState.acceleration + amount };
    }

    private updateMomentum(movementState: MovementState): MovementState {
        const newSpeed = movementState.speed + movementState.acceleration;
        if (newSpeed > 0 && newSpeed < movementState.maxSpeed) {
            return { ...movementState, speed: newSpeed };
        } else if (newSpeed < 0) {
            return { ...movementState, speed: 0 };
        } else if (newSpeed > movementState.maxSpeed) {
            return { ...movementState, speed: movementState.maxSpeed };
        } else {
            return movementState;
        }
    }
}
