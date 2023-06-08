import { Effect } from '../components/Render'
import { Circle, Dot, Polygon, Rectangle, Shape } from '../components/Transform'
import { Position, Direction } from '../Math'

export interface DrawParameters {
    position: Position
    color: string
    direction?: Direction
    effect?: Effect
}

export abstract class ShapeDrawer<T extends Shape> {
    constructor(readonly ctx: CanvasRenderingContext2D) {}

    draw(shape: T, params: DrawParameters) {
        this.ctx.save()
        this.drawInternal(shape, params)
        this.ctx.restore()
    }

    protected abstract drawInternal(shape: T, params: DrawParameters): void

    protected addEffect(effect?: Effect) {
        if (!effect) return

        const now = performance.now()
        const { durationMs, startedMs } = effect

        if (now - startedMs > durationMs) {
            effect.startedMs = performance.now()
            return
        }

        this.ctx.globalAlpha = 1 - ((now - startedMs) / durationMs)
    }
}

export class DotDrawer extends ShapeDrawer<Dot> {
    protected drawInternal(shape: Dot, instructions: DrawParameters): void {
        const { position, effect, color } = instructions

        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.addEffect(effect)

        const [x, y] = position
        this.ctx.fillRect(x, y, 2, 2)
        this.ctx.stroke()
    }
}

export class CircleDrawer extends ShapeDrawer<Circle> {
    protected drawInternal(shape: Circle, instructions: DrawParameters): void {
        const { position, effect, color } = instructions

        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.lineWidth = 2
        this.addEffect(effect)

        const [x, y] = position
        this.ctx.arc(x, y, shape.radius, 0, 2 * Math.PI, true)
        this.ctx.closePath()
        this.ctx.fill()
    }
}

export class RectangleDrawer extends ShapeDrawer<Rectangle> {
    protected drawInternal(shape: Rectangle, instructions: DrawParameters): void {
        const { position, effect, color } = instructions

        this.ctx.beginPath()
        this.addEffect(effect)

        const [ x, y ] = position
        const [ w, h ] = shape.dimensions
        if (shape.fill) {
            this.ctx.fillStyle = color
            this.ctx.fillRect(x, y, w, h)
        } else {
            this.ctx.strokeStyle = color
            this.ctx.strokeRect(x, y, w, h)
        }
        this.ctx.stroke()
    }
}

export class PolygonDrawer extends ShapeDrawer<Polygon> {
    protected drawInternal(shape: Polygon, instructions: DrawParameters): void {
        const { effect, color } = instructions

        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.addEffect(effect)

        const [ firstPoint, ...restPoints ] = shape.points

        this.ctx.moveTo(firstPoint[0], firstPoint[1])
        restPoints.forEach(([x, y]) => this.ctx.lineTo(x, y))
        this.ctx.fill()
    }
}
