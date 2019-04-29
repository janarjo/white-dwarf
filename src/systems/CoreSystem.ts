import { CommandManager } from '../CommandManager';
import { ComponentCode } from '../components/Components';
import { Core, CoreState } from '../components/Core';
import { getProjectile } from '../EntityAssembly';
import { EntityManager } from '../EntityManager';
import { EventManager } from '../EventManager';
import { Event, EventType } from '../events/Event';
import { MoveEvent } from '../events/MoveEvent';
import { TurnEvent } from '../events/TurnEvent';
import { Vector } from '../math/Vector';
import { System } from './System';

export class CoreSystem extends System {
    constructor(
        readonly entityManager: EntityManager,
        readonly eventManager: EventManager) {
        super();
        this.registerListeners();
    }

    registerListeners(): void {
        this.eventManager.registerListener(EventType.TURN, (event: Event) => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(ComponentCode.CORE) as Core | undefined;
            if (!core) return;

            const turnEvent = (event as TurnEvent);
            core.state = this.updateOrientation(core.state, turnEvent.data.turningSpeed);
        });
        this.eventManager.registerListener(EventType.MOVE, (event: Event) => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(ComponentCode.CORE) as Core | undefined;
            if (!core) return;

            const moveEvent = (event as MoveEvent);
            core.state = this.updatePosition(core.state, moveEvent.data.speed);
        });
        this.eventManager.registerListener(EventType.FIRE, (event: Event) => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(ComponentCode.CORE) as Core | undefined;
            if (!core) return;

            this.entityManager.createEntity(getProjectile(core.state.position, core.state.orientation));
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
