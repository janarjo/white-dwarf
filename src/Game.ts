import { EntityManager } from './EntityManager'
import { LevelManager } from './LevelManager'
import { CameraSystem } from './systems/CameraSystem'
import { CollisionSystem } from './systems/CollisionSystem'
import { ControlSystem } from './systems/ControlSystem'
import { HealthSystem } from './systems/HealthSystem'
import { HubSystem } from './systems/HubSystem'
import { MovementSystem } from './systems/MovementSystem'
import { RenderSystem } from './systems/RenderSystem'
import { System } from './systems/System'
import { TransformSystem } from './systems/TransformSystem'
import { WeaponSystem } from './systems/WeaponSystem'
import { Dimensions } from './Math'

export class Game {
    readonly isDebug = true
    readonly fps = 60
    readonly interval = 1000 / this.fps
    then: number = performance.now()

    readonly levelManager: LevelManager
    readonly canvas: HTMLCanvasElement
    readonly viewPort: Dimensions

    constructor(canvas: HTMLCanvasElement) {
        this.viewPort = [canvas.width, canvas.height] as const
        this.canvas = canvas
        this.levelManager = new LevelManager(this.viewPort)
    }

    start(levelNo: number) {
        const level = this.levelManager.getLevel(levelNo)
        const { mapSize, entities, stars } = level
        const systems = [
            new ControlSystem(entities, this.canvas),
            new MovementSystem(entities),
            new TransformSystem(entities, mapSize),
            new CollisionSystem(entities),
            new WeaponSystem(entities),
            new HealthSystem(entities),
            new CameraSystem(entities, this.viewPort, mapSize),
            new HubSystem(entities),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new RenderSystem(entities, this.canvas.getContext('2d')!, stars, this.isDebug),
        ]

        level.init()
        this.gameLoop(entities, systems)
    }

    gameLoop(entities: EntityManager, systems: System[]) {
        requestAnimationFrame(() => this.gameLoop(entities, systems))

        const now = performance.now()
        const delta = now - this.then

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval))
            entities.proccess(systems)
            entities.clean()
        }
    }
}
