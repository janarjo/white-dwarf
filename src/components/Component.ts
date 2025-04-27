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
    CONDITION_HUB,
    EMITTER,
    AI,
    ITEM,
    INVENTORY,
    QUICK_SLOT
}

export interface ComponentState {}

export abstract class Component<T extends ComponentState = ComponentState> {
    constructor(
            readonly code: ComponentCode,
            readonly name: string,
            readonly state: T,
            // Whether the component is shared between parent and child entities
            readonly shared: boolean = false) {
    }
}

export type Entity = Component[]
export type ComponentConstructor<T extends Component, Y extends ComponentState> = new (state: Y) => T

