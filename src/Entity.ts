import { Component, ComponentCode } from './components/Components';
import { Vector } from './math/Vector';

export class Entity {
    constructor(
            readonly id: number,
            readonly components: Component[]) {
    }

    getComponent(code: ComponentCode): Component | undefined {
        return this.components.find((component) => component.code === code);
    }
}
