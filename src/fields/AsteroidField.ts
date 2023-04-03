import { EntityManager } from '../EntityManager'
import { Dimensions, randInt, rand, hvec, generateRandomPolygon, Position, Direction } from '../Math'
import { Field } from './Field'
import { asteroid } from '../Assembly'
import { Component } from '../components/Component'

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
            this.generateAsteroid([randInt([0, mapW]), mapH + mapPad], hvec(rand(0, -Math.PI))),
            this.generateAsteroid([randInt([0, mapW]), -mapPad], hvec(rand(0, Math.PI))),
            this.generateAsteroid([-mapPad, randInt([0, mapH])], hvec(rand(-Math.PI / 2, Math.PI / 2))),
            this.generateAsteroid([mapW + mapPad, randInt([0, mapH])], hvec(rand(Math.PI / 2, 3 * Math.PI / 2))),
        ]
        asteroids.forEach(asteroid => this.entities.create(asteroid))
    }

    private generateAsteroid(position: Position, direction: Direction): Component[] {  
        return asteroid(position, direction, generateRandomPolygon(randInt([5, 10]), 10, 20))
    }
}
