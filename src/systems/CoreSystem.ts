import { getProjectile } from '../Assembly';
import { Core, CoreState } from '../components/Core';
import { Entities } from '../entities/Entities';
import { EventType } from '../events/Event';
import { Events } from '../events/Events';
import { Vector } from '../math/Vector';
import { System } from './System';

export class CoreSystem extends System {
    constructor(
        readonly entities: Entities,
        readonly events: Events) {
        super();
        this.registerListeners();
    }

    registerListeners(): void {
        this.events.on(EventType.TURN, event => {
            const core = this.entities.getComponent(event.entityId, Core);
            if (!core) return;

            core.state = this.updateOrientation(core.state, event.data.turningSpeed);
        });
        this.events.on(EventType.MOVE, event => {
            const entity = this.entities.get(event.entityId);
            const core = entity && entity.getComponent(Core);
            if (!core) return;

            core.state = this.updatePosition(core.state, event.data.speed);
        });
        this.events.on(EventType.FIRE, event => {
            const entity = this.entities.get(event.entityId);
            const core = entity && entity.getComponent(Core);
            if (!core) return;

            this.entities.create(getProjectile(core.state.position, core.state.orientation));
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
