import { Controller } from './Controller';
import { Vector } from './math/Vector';

let controller: Controller;

window.onload = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    controller = new Controller(ctx, new Vector(1280, 720));

    document.addEventListener('keydown', (event) => controller.handleInput(event, true));
    document.addEventListener('keyup', (event) => controller.handleInput(event, false));

    controller.gameLoop();
};
