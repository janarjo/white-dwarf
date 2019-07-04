import { Core, CoreState } from '../components/Core';
import { getProjectile } from '../EntityAssembly';
import { EntityManager } from '../EntityManager';
import { EventManager } from '../EventManager';
import { EventType } from '../events/Event';
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
        this.eventManager.on(EventType.TURN, event => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(Core);
            if (!core) return;

            core.state = this.updateOrientation(core.state, event.data.turningSpeed);
        });
        this.eventManager.on(EventType.MOVE, event => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(Core);
            if (!core) return;

            core.state = this.updatePosition(core.state, event.data.speed);
        });
        this.eventManager.on(EventType.FIRE, event => {
            const entity = this.entityManager.getEntity(event.entityId);
            const core = entity && entity.getComponent(Core);
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
