import { Controller } from './Controller'

window.onload = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const controller: Controller = new Controller(canvas)

    controller.gameLoop()
}
