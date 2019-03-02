import { Event, EventType } from './Event';

export interface TurnEventData {
    turningSpeed: number;
}

export class TurnEvent extends Event {
    constructor(
        readonly entityId: number,
        readonly data: TurnEventData) {
        super(entityId, EventType.TURN, 'TurnEvent', { data });
    }
}
