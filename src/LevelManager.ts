import { asteroid, blaster, camera, player } from './Assembly'
import { EntityManager } from './EntityManager'
import { Dimensions, Position } from './Math'

export class Level {
    constructor(
        readonly mapSize: Dimensions,
        readonly stars: ReadonlyArray<Star>,
        readonly entities: EntityManager,
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

    generateStars(size: Dimensions, count: number): Star[] {
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

        return new Level([2000, 2000], stars, entities, () => {
            const playerId = entities.create(player([640, 360]))

            const cameraId = entities.create(camera())
            entities.attach(playerId, cameraId)

            setInterval(() => entities.create(asteroid([320, 150], Math.random() * Math.PI)), 1000)

            const blasterId = entities.create(blaster())
            entities.attach(playerId, blasterId)
        })
    }
}
