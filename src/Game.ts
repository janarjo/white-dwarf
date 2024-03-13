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
import { FrameTimeAnalyzer } from './FrameTimeAnalyzer'

export enum UIMode {
    GAME,
    INVENTORY,
}

export class Game {
    readonly clock = new Clock(60)
    readonly isDebug = true

    readonly levels: LevelManager
    readonly sounds: SoundManager
    readonly canvas: HTMLCanvasElement
    readonly viewPort: Dimensions
    static mode = UIMode.GAME

    readonly fta: FrameTimeAnalyzer

    constructor(canvas: HTMLCanvasElement) {
        this.viewPort = [canvas.width, canvas.height] as const
        this.canvas = canvas
        this.levels = new LevelManager(this.viewPort)
        this.sounds = new SoundManager()
        this.fta = new FrameTimeAnalyzer()
    }

    start(levelNo: number) {
        const level = this.levels.getLevel(levelNo)
        const { mapSize, entities, fields, stars } = level
        const systems = [
            new TransformSystem(entities, mapSize),
            new ControlSystem(entities, this.canvas),
            new EntityHubSystem(entities),
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
            new RenderSystem(entities, new Drawer(this.canvas.getContext('2d')!), stars),
        ] as const

        this.canvas.addEventListener('keydown', (event) => {
            if (event.key === 'Pause') this.pause()
            if (event.key === 'i') Game.mode = Game.mode === UIMode.GAME ? UIMode.INVENTORY : UIMode.GAME
        })

        level.init()
        this.gameLoop(performance.now(), entities, systems, fields)
    }

    gameLoop(
            frameTime: number,
            entities: EntityManager,
            systems: ReadonlyArray<System>,
            fields: ReadonlyArray<Field>) {
        requestAnimationFrame((time) => this.gameLoop(time, entities, systems, fields))

        this.clock.tick(frameTime, (timings) => {
            fields.forEach(field => field.generate())
            systems.forEach(system => system.update(timings, this.isDebug && this.fta.getDebugInfo()))
            entities.clean()
        })

        this.isDebug && this.fta.updateFrameRateInfo(frameTime)
    }

    private pause() {
        this.clock.isPaused() ? this.clock.setRate(1) : this.clock.setRate(0)
    }
}
