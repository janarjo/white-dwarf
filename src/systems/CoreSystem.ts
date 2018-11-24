import { ComponentCode } from '../components/Components';
import { Core, CoreState } from '../components/Core';
import { Entity } from '../Entity';
import { Event, EventType } from '../events/Event';
import { MoveEvent } from '../events/MoveEvent';
import { TurnEvent, TurnEventDirection } from '../events/TurnEvent';
import { Vector } from '../math/Vector';
import { System } from './System';

export class CoreSystem extends System {

    update(entities: Entity[]): void {
        return;
    }

    registerListeners(): void {
        this.eventManager.registerListener(EventType.TURN, (event: Event) => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(ComponentCode.CORE) as Core | undefined;
            if (core) {
                const turnEvent = (event as TurnEvent);
                switch (turnEvent.data.direction) {
                    case TurnEventDirection.LEFT:
                        core.state = this.updateOrientation(core.state, -turnEvent.data.turningSpeed);
                        break;
                    case TurnEventDirection.RIGHT:
                        core.state = this.updateOrientation(core.state, turnEvent.data.turningSpeed);
                        break;
                }
            }
        });

        this.eventManager.registerListener(EventType.MOVE, (event: Event) => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(ComponentCode.CORE) as Core | undefined;
            if (core) {
                const moveEvent = (event as MoveEvent);
                core.state = this.updatePosition(core.state, moveEvent.data.speed);
            }
        });
    }

    private updateOrientation(coreState: CoreState, turningSpeed: number): CoreState {
        const newOrientation = coreState.orientation + turningSpeed;
        return { ...coreState, orientation: newOrientation };
    }

    private updatePosition(coreState: CoreState, speed: number): CoreState {
        const motionX = speed * Math.cos(coreState.orientation);
        const motionY = speed * Math.sin(coreState.orientation);
        const newPosition = coreState.position.add(new Vector(motionX, motionY));
        return { ...coreState, position: newPosition };
    }
}
