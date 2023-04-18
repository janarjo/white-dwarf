export enum ComponentCode {
    TRANSFORM,
    CONTROL,
    PHYSICS,
    WEAPON,
    RENDER,
    COLLISION,
    HEALTH,
    CAMERA,
    ATTACHMENT,
    ENTITY_HUB,
    EFFECT_HUB,
    EMITTER,
    AI,
    ITEM,
    INVENTORY,
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
