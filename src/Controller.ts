import { EntityManager } from './EntityManager'
import { GameManager } from './GameManager'
import { Dimensions } from './Math'
import { AttachmentSystem } from './systems/AttachmentSystem'
import { CameraSystem } from './systems/CameraSystem'
import { CollisionSystem } from './systems/CollisionSystem'
import { ControlSystem } from './systems/ControlSystem'
import { HealthSystem } from './systems/HealthSystem'
import { MovementSystem } from './systems/MovementSystem'
import { RenderSystem } from './systems/RenderSystem'
import { System } from './systems/System'
import { TransformSystem } from './systems/TransformSystem'
import { WeaponSystem } from './systems/WeaponSystem'

export class Controller {
    readonly isDebug = true
    readonly fps = 60
    readonly interval = 1000 / this.fps
    then: number = performance.now()

    readonly entities: EntityManager
    readonly gameManager: GameManager

    readonly systems: System[]

    readonly mapSize: Dimensions = [2000, 2000]

    constructor(canvas: HTMLCanvasElement) {
        this.entities = new EntityManager()
        this.gameManager = new GameManager(this.entities)
        this.systems = [
            new ControlSystem(this.entities, canvas),
            new MovementSystem(this.entities),
            new TransformSystem(this.entities, this.mapSize),
            new CollisionSystem(this.entities),
            new WeaponSystem(this.entities),
            new HealthSystem(this.entities),
            new CameraSystem(this.entities, [canvas.width, canvas.height], this.mapSize),
            new AttachmentSystem(this.entities),
            new RenderSystem(this.entities, canvas.getContext('2d')!, this.isDebug),
        ]
        this.gameManager.initWorld()
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop())

        const now = performance.now()
        const delta = now - this.then

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval))
            this.gameManager.generateAsteroids()
            this.entities.proccess(this.systems)
            this.entities.clean()
        }
    }
}
