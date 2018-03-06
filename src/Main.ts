import { Game } from './domain/Game';
import { Player } from './domain/Player';

import { Controller } from './Controller';
import { Vector } from './math/Vector';
import { Circle } from './ui/Circle';
import { Painter } from './ui/Painter';
import { Triangle } from './ui/Triangle';

const game = new Game();
let controller: Controller;
let painter: Painter;

window.onload = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    painter = new Painter(ctx, game.size);
    controller = new Controller(game, painter);

    document.addEventListener('keydown', (event) => controller.handleInput(event, true));
    document.addEventListener('keyup', (event) => controller.handleInput(event, false));

    controller.gameLoop();
};
