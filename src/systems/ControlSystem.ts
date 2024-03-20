import { Control } from '../components/Control'
import { Transform } from '../components/Transform'
import { EntityManager } from '../EntityManager'
import { add, angleBetween, subtract } from '../Math'
import { System } from './System'

export class ControlSystem implements System {
    constructor(
        private readonly entities: EntityManager,
        canvas: HTMLCanvasElement) {
        canvas.addEventListener('keydown', (event) => this.handleKeyInput(event, true))
        canvas.addEventListener('keyup', (event) => this.handleKeyInput(event, false))
        canvas.addEventListener('mousedown', (event) => this.handleMouseInput(event, true))
        canvas.addEventListener('mouseup', (event) => this.handleMouseInput(event, false))
        canvas.addEventListener('contextmenu', (event) => event.preventDefault())
        canvas.addEventListener('mousemove', (event) => { this.handleMouseMovement(event) })
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update(): void {
        this.entities.withComponents(Control, Transform).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            const transform = this.entities.getComponent(id, Transform)

            const { direction, position } = transform.state
            const { canvasPointer } = control.state

            if (canvasPointer) {
                const camera = this.entities.getCamera()
                const origin = camera.state.origin
                const pointerPosition = add(canvasPointer, origin)
                const targetDirection = subtract(pointerPosition, position)
                // Calculate the angle between the current heading direction and the direction towards the mouse cursor
                const diff = angleBetween(direction, targetDirection)
                if (Math.abs(diff) < 0.05) {
                    control.state.isTurningLeft = false
                    control.state.isTurningRight = false
                } else if (diff > 0) {
                    control.state.isTurningLeft = false
                    control.state.isTurningRight = true
                } else {
                    control.state.isTurningLeft = true
                    control.state.isTurningRight = false
                }
            }
        })
    }

    handleKeyInput(event: KeyboardEvent, isKeyDown: boolean) {
        this.entities.withComponents(Control).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            switch (event.key) {
                case 'a': {
                    control.state.isTurningLeft = isKeyDown ? true : false
                    break
                }
                case 'w': {
                    control.state.isAccelerating = isKeyDown ? true : false
                    break
                }
                case 'd': {
                    control.state.isTurningRight = isKeyDown ? true : false
                    break
                }
                case 's': {
                    control.state.isDecelerating = isKeyDown ? true : false
                    break
                }
                case ' ': {
                    control.state.isBraking = isKeyDown ? true : false
                }
                default: {
                    if (event.key.match(/\d/)) {
                        control.state.quickSlotIndex = (Number(event.key) - 1)
                    }
                }
            }
        })
    }

    handleMouseInput(event: MouseEvent, isMouseDown: boolean) {
        this.entities.withComponents(Control).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            switch (event.button) {
                case 0: {
                    control.state.isFiring = isMouseDown ? true : false
                    break
                }
            }
        })
    }

    handleMouseMovement(event: MouseEvent) {
        this.entities.withComponents(Control).forEach(id => {
            const control = this.entities.getComponent(id, Control)
            control.state.canvasPointer = [event.clientX, event.clientY] as const
        })
    }
}
