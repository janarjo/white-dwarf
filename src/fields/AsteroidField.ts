import { EntityManager } from '../EntityManager'
import { Dimensions, randInt, rand } from '../Math'
import { Field } from './Field'
import { asteroid } from '../Assembly'

export class AsteroidField implements Field {
    constructor(
        readonly entities: EntityManager,
        readonly mapSize: Dimensions,
        readonly intervalMs: number) {
    }

    lastGenerate: number = performance.now()

    generate(): void {
        const now = performance.now()
        if (now - this.lastGenerate < this.intervalMs) return

        this.lastGenerate = now

        const mapPad = 30
        const [mapW, mapH] = this.mapSize

        const asteroids = [
            asteroid([randInt([0, mapW]), mapH + mapPad], rand(0, -Math.PI)),
            asteroid([randInt([0, mapW]), -mapPad], rand(0, Math.PI)),
            asteroid([-mapPad, randInt([0, mapH])], rand(-Math.PI / 2, Math.PI / 2)),
            asteroid([mapW + mapPad, randInt([0, mapH])], rand(Math.PI / 2, 3 * Math.PI / 2)),
        ]
        asteroids.forEach(asteroid => this.entities.create(asteroid))
    }
}
