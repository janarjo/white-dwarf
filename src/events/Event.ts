export enum EventType {
    MOVE,
    TURN,
    ACCELERATE,
    FIRE,
}

export abstract class Event {
    constructor(
            readonly entityId: number,
            readonly type: EventType,
            readonly name: string,
            readonly data: { [key: string]: any }) {
    }
}
