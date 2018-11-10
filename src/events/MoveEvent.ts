import { Event, EventType } from './Event';

export interface MoveEventData {
    speed: number;
}

export class MoveEvent extends Event {
    constructor(
        readonly entityId: number,
        readonly data: MoveEventData) {
        super(entityId, EventType.MOVE, 'MoveEvent', { data });
    }
}
