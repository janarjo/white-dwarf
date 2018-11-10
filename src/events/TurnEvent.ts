import { Event, EventType } from './Event';

export enum TurnEventDirection {
    LEFT,
    RIGHT,
}

export interface TurnEventData {
    direction: TurnEventDirection;
}

export class TurnEvent extends Event {
    constructor(
        readonly entityId: number,
        readonly data: TurnEventData) {
        super(entityId, EventType.TURN, 'TurnEvent', { data });
    }
}
