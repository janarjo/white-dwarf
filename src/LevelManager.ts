import { missileLauncher } from './assembly/Weapons'
import { blaster } from './assembly/Weapons'
import { enemy } from './assembly/Core'
import { player } from './assembly/Core'
import { camera } from './assembly/Core'
import { EntityManager } from './EntityManager'
import { Dimensions, Position } from './math/Math'
import { AsteroidField } from './fields/AsteroidField'
import { Field } from './fields/Field'

export class Level {
    constructor(
        readonly mapSize: Dimensions,
        readonly stars: ReadonlyArray<Star>,
        readonly entities: EntityManager,
        readonly fields: ReadonlyArray<Field> = [],
        readonly init: () => void) {}
}

export interface Star {
    intensity: number
    position: Position
}

export class LevelManager {
    private readonly levels: Map<number, Level>

    constructor(private readonly viewport: Dimensions) {
        this.levels = new Map<number, Level>([
            [0, this.getLevel0()],
        ])
    }

    getLevel(levelNo: number): Level {
        const level = this.levels.get(levelNo)
        if (!level) throw new Error(`No such level: ${levelNo}`)
        return level
    }

    private generateStars(size: Dimensions, count: number): Star[] {
        const stars: Star[] = []
        for (let i = 0; i < count; i++) {
            stars.push({
                intensity: Math.random() * 255,
                position: [Math.random() * size[0], Math.random() * size[1]],
            })
        }
        return stars
    }

    private getLevel0(): Level {
        const stars = this.generateStars(this.viewport, 500)
        const entities = new EntityManager()
        const mapSize = [2000, 2000] as const
        const fields = [new AsteroidField(entities, mapSize, 2000)]
        const init = () => {
            const playerId = entities.add(player([640, 360]))

            const cameraId = entities.add(camera())
            entities.attach(playerId, cameraId)

            const blasterId = entities.add(blaster())
            entities.attach(playerId, blasterId)

            const missileLauncherId = entities.add(missileLauncher())
            entities.attach(playerId, missileLauncherId)

            const enemyId = entities.add(enemy([420, 260]))
            const enemyBlasterId = entities.add(blaster())
            entities.attach(enemyId, enemyBlasterId)
        }

        return new Level(mapSize, stars, entities, fields, init)
    }
}
