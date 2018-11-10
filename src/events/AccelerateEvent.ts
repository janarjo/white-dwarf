import { Event, EventType } from './Event';

export interface AccelerateEventData {
    amount: number;
}

export class AccelerateEvent extends Event {
    constructor(
        readonly entityId: number,
        readonly data: AccelerateEventData) {
        super(entityId, EventType.ACCELERATE, 'AccelerateEvent', { data });
    }
}
