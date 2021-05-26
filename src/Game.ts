import { EntityManager } from './EntityManager'
import { LevelManager } from './LevelManager'
import { CameraSystem } from './systems/CameraSystem'
import { CollisionSystem } from './systems/CollisionSystem'
import { ControlSystem } from './systems/ControlSystem'
import { HealthSystem } from './systems/HealthSystem'
import { EntityHubSystem } from './systems/EntityHubSystem'
import { MovementSystem } from './systems/MovementSystem'
import { RenderSystem } from './systems/RenderSystem'
import { System } from './systems/System'
import { TransformSystem } from './systems/TransformSystem'
import { WeaponSystem } from './systems/WeaponSystem'
import { Dimensions } from './Math'
import { Field } from './fields/Field'
import { EmitterSystem } from './systems/EmitterSystem'
import { EffectHubSystem } from './systems/EffectHubSystem'

export class Game {
    readonly isDebug = true
    readonly fps = 60
    readonly intervalMs = 1000 / this.fps
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
        const { mapSize, entities, fields, stars } = level
        const systems = [
            new ControlSystem(entities, this.canvas),
            new MovementSystem(entities),
            new TransformSystem(entities, mapSize),
            new CollisionSystem(entities),
            new WeaponSystem(entities),
            new HealthSystem(entities),
            new CameraSystem(entities, this.viewPort, mapSize),
            new EntityHubSystem(entities),
            new EmitterSystem(entities),
            new EffectHubSystem(entities),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new RenderSystem(entities, this.canvas.getContext('2d')!, stars, this.isDebug),
        ] as const

        level.init()
        this.gameLoop(entities, systems, fields)
    }

    gameLoop(
            entities: EntityManager, 
            systems: ReadonlyArray<System>, 
            fields: ReadonlyArray<Field>) {
        requestAnimationFrame(() => this.gameLoop(entities, systems, fields))

        const now = performance.now()
        const delta = now - this.then

        if (delta > this.intervalMs) {
            this.then = now - (delta % (this.intervalMs))

            fields.forEach(field => field.generate())
            systems.forEach(system => system.update())
            entities.clean()
        }
    }
}
