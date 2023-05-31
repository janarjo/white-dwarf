import { EntityManager } from './EntityManager'
import { LevelManager } from './LevelManager'
import { CameraSystem } from './systems/CameraSystem'
import { CollisionSystem } from './systems/CollisionSystem'
import { ControlSystem } from './systems/ControlSystem'
import { HealthSystem } from './systems/HealthSystem'
import { EntityHubSystem } from './systems/EntityHubSystem'
import { PhysicsSystem } from './systems/PhysicsSystem'
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
import { SoundManager } from './SoundManager'

export enum UIMode {
    GAME,
    INVENTORY,
}

export class Game {
    readonly fps = 60
    readonly clock = new Clock(this.fps)
    readonly isDebug = true

    readonly levels: LevelManager
    readonly sounds: SoundManager
    readonly canvas: HTMLCanvasElement
    readonly viewPort: Dimensions
    static mode = UIMode.GAME

    constructor(canvas: HTMLCanvasElement) {
        this.viewPort = [canvas.width, canvas.height] as const
        this.canvas = canvas
        this.levels = new LevelManager(this.viewPort)
        this.sounds = new SoundManager()
    }

    start(levelNo: number) {
        const level = this.levels.getLevel(levelNo)
        const { mapSize, entities, fields, stars } = level
        const systems = [
            new TransformSystem(entities, mapSize),
            new EntityHubSystem(entities),
            new ControlSystem(entities, this.canvas),
            new AISystem(entities),
            new CollisionSystem(entities),
            new PhysicsSystem(entities),
            new WeaponSystem(entities, this.sounds),
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
