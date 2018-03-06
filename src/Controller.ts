import { Game } from './domain/Game';
import { Player } from './domain/Player';
import { Vector } from './math/Vector';
import { Painter } from './ui/Painter';

export class Controller {
    readonly fps = 60;
    readonly interval = 1000 / this.fps;
    then: number = Date.now();

    isAccelerating = false;
    isDecelerating = false;
    isTurningLeft = false;
    isTurningRight = false;

    constructor(
            readonly game: Game,
            readonly painter: Painter) {
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval));
            this.applyPlayerInput();
            this.game.entities.forEach((e) => e.move());
            this.painter.paint(this.game.entities);
        }
    }

    applyPlayerInput() {
        const player = this.game.player;
        if (this.isAccelerating) {
            player.accelerate();
        }
        if (this.isDecelerating) {
            player.decelerate();
        }
        if (this.isTurningLeft) {
            player.turnLeft();
        }
        if (this.isTurningRight) {
            player.turnRight();
        }
    }

    handleInput(event: KeyboardEvent, isKeyDown: boolean) {
        switch (event.keyCode) {
            case 37: {
                this.isTurningLeft = isKeyDown ? true : false;
                break;
            }
            case 38: {
                this.isAccelerating = isKeyDown ? true : false;
                break;
            }
            case 39: {
                this.isTurningRight = isKeyDown ? true : false;
                break;
            }
            case 40: {
                this.isDecelerating = isKeyDown ? true : false;
                break;
            }
        }
    }
}
