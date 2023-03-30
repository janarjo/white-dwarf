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
import { Drawer } from './ui/Drawer'
import { AISystem } from './systems/AISystem'
import { Clock } from './Clock'
import { InventorySystem } from './systems/InventorySystem'

export enum UIMode {
    GAME,
    INVENTORY,
}

export class Game {
    readonly fps = 60
    readonly clock = new Clock(this.fps)
    readonly isDebug = true

    readonly levelManager: LevelManager
    readonly canvas: HTMLCanvasElement
    readonly viewPort: Dimensions
    static mode = UIMode.GAME

    constructor(canvas: HTMLCanvasElement) {
        this.viewPort = [canvas.width, canvas.height] as const
        this.canvas = canvas
        this.levelManager = new LevelManager(this.viewPort)
    }

    start(levelNo: number) {
        const level = this.levelManager.getLevel(levelNo)
        const { mapSize, entities, fields, stars } = level
        const systems = [
            new EntityHubSystem(entities),
            new ControlSystem(entities, this.canvas),
            new AISystem(entities),
            new MovementSystem(entities),
            new TransformSystem(entities, mapSize),
            new CollisionSystem(entities),
            new WeaponSystem(entities),
            new HealthSystem(entities),
            new CameraSystem(entities, this.viewPort, mapSize),
            new EmitterSystem(entities),
            new EffectHubSystem(entities),
            new InventorySystem(entities),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new RenderSystem(entities, new Drawer(this.canvas.getContext('2d')!), stars, this.isDebug),
        ] as const

        this.canvas.addEventListener('keydown', (event) => {
            if (event.key === 'Pause') this.pause()
            if (event.key === 'i') Game.mode = Game.mode === UIMode.GAME ? UIMode.INVENTORY : UIMode.GAME
        })

        level.init()
        this.gameLoop(entities, systems, fields)
    }

    gameLoop(
            entities: EntityManager, 
            systems: ReadonlyArray<System>, 
            fields: ReadonlyArray<Field>) {
        requestAnimationFrame(() => this.gameLoop(entities, systems, fields))

        this.clock.tick(dt => {
            fields.forEach(field => field.generate())
            systems.forEach(system => system.update(dt))
            entities.clean()
        })
    }

    private pause() {
        this.clock.isPaused() ? this.clock.setRate(1) : this.clock.setRate(0)
    }
}
