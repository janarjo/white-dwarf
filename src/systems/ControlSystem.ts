import { Control } from '../components/Control'
import { EntityManager } from '../EntityManager'
import { System } from './System'

export class ControlSystem extends System {
    constructor(
        private readonly entities: EntityManager,
        canvas: HTMLCanvasElement) {
        super()
        canvas.addEventListener('keydown', (event) => this.handleInput(event, true))
        canvas.addEventListener('keyup', (event) => this.handleInput(event, false))
    }

    handleInput(event: KeyboardEvent, isKeyDown: boolean) {
        this.entities.withComponents(Control).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            switch (event.keyCode) {
                case 32: {
                    control.state.isFiring = isKeyDown ? true : false
                    break
                }
                case 37: {
                    control.state.isTurningLeft = isKeyDown ? true : false
                    break
                }
                case 38: {
                    control.state.isAccelerating = isKeyDown ? true : false
                    break
                }
                case 39: {
                    control.state.isTurningRight = isKeyDown ? true : false
                    break
                }
                case 40: {
                    control.state.isDecelerating = isKeyDown ? true : false
                    break
                }
            }
        })
    }
}
