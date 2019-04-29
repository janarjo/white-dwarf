import { Component } from './components/Components';

export class Entity {
    constructor(
            readonly id: number,
            readonly components: Component[]) {
    }

    getComponent<T extends Component>(type: new (state: any) => T): T | undefined {
        return this.components.find((component) => component instanceof type) as T | undefined;
    }
}
