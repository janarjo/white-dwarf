import { Game } from './Game'

window.onload = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const game: Game = new Game(canvas)

    game.start(0)
}
