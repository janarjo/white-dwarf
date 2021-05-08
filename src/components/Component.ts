export enum ComponentCode {
    TRANSFORM,
    CONTROL,
    MOVEMENT,
    WEAPON,
    RENDER,
    COLLISION,
    HEALTH,
    CAMERA,
    ATTACHMENT,
    HUB,
}

export interface ComponentState {
    [key: string]: unknown
}

export abstract class Component {
    constructor(
            readonly code: ComponentCode,
            readonly name: string,
            readonly state: ComponentState) {
    }
}

export type Entity = Component[]
