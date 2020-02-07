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

export class Game {
    readonly isDebug = true
    readonly fps = 60
    readonly interval = 1000 / this.fps
    then: number = performance.now()

    readonly entities: EntityManager
    readonly levelManager: LevelManager

    readonly systems: System[]

    constructor(canvas: HTMLCanvasElement) {
        const viewport = [canvas.width, canvas.height] as const
        this.levelManager = new LevelManager(viewport)
        const level = this.levelManager.getLevel(0)
        const { mapSize, entities, stars } = level
        this.entities = entities
        this.systems = [
            new ControlSystem(this.entities, canvas),
            new MovementSystem(this.entities),
            new TransformSystem(this.entities, mapSize),
            new CollisionSystem(this.entities),
            new WeaponSystem(this.entities),
            new HealthSystem(this.entities),
            new CameraSystem(this.entities, viewport, mapSize),
            new HubSystem(this.entities),
            new RenderSystem(this.entities, canvas.getContext('2d')!, stars, this.isDebug),
        ]
        level.init()
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop())

        const now = performance.now()
        const delta = now - this.then

        if (delta > this.interval) {
            this.then = now - (delta % (this.interval))
            this.entities.proccess(this.systems)
            this.entities.clean()
        }
    }
}
