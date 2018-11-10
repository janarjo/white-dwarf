import { Event, EventType } from './Event';

export class FireEvent extends Event {
    constructor(entityId: number) {
        super(entityId, EventType.FIRE, 'FireEvent', {});
    }
}
