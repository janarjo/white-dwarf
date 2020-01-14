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

export abstract class Component {
    constructor(
            readonly code: ComponentCode,
            readonly name: string,
            state: { [key: string]: any }) {
    }
}
