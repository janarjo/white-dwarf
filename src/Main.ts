import { Controller } from './Controller';
import { Vector } from './math/Vector';

window.onload = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const controller: Controller = new Controller(canvas, [1280, 720]);

    controller.gameLoop();
};
