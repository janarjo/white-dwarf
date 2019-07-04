import { AccelerateEvent } from './AccelerateEvent';
import { FireEvent } from './FireEvent';
import { MoveEvent } from './MoveEvent';
import { TurnEvent } from './TurnEvent';

export enum EventType {
    MOVE,
    TURN,
    ACCELERATE,
    FIRE,
}

export interface EventMap {
    [EventType.MOVE]: MoveEvent;
    [EventType.TURN]: TurnEvent;
    [EventType.ACCELERATE]: AccelerateEvent;
    [EventType.FIRE]: FireEvent;
}

export abstract class Event {
    constructor(
            readonly entityId: number,
            readonly type: EventType,
            readonly name: string,
            readonly data: { [key: string]: any }) {
    }
}
