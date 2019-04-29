export enum ComponentCode {
    CORE,
    CONTROL,
    MOVEMENT,
    WEAPON,
    RENDER,
}

export abstract class Component {
    constructor(
            readonly code: ComponentCode,
            readonly name: string,
            state: { [key: string]: any }) {
    }
}
