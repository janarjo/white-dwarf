import { DrawEffect, DrawEffectCode, Fade, Glow } from '../components/Render'
import { Circle, Polygon, Rectangle, Shape } from '../components/Transform'
import { Position, Direction, subtract, scale } from '../math/Math'
import { Color } from './Colors'

export interface DrawParameters {
    zoom: number
    origin: Position
    position: Position
    color: Color
    direction?: Direction
    effect?: DrawEffect
}

export abstract class ShapeDrawer<T extends Shape> {
    constructor(readonly ctx: CanvasRenderingContext2D) {}

    draw(shape: T, params: DrawParameters) {
        this.ctx.save()
        this.drawInternal(shape, params)
        this.ctx.restore()
    }

    protected abstract drawInternal(shape: T, params: DrawParameters): void

    protected addEffect(effect?: DrawEffect) {
        if (!effect) return
        if (effect.code === DrawEffectCode.FADE) this.addFade(effect)
        if (effect.code === DrawEffectCode.GLOW) this.addGlow(effect)
    }

    private addFade(effect: Fade) {
        const now = performance.now()
        const { durationMs, startedMs } = effect

        if (now - startedMs > durationMs) {
            effect.startedMs = performance.now()
            return
        }

        this.ctx.globalAlpha = 1 - ((now - startedMs) / durationMs)
    }

    private addGlow(effect: Glow) {
        const { radius, color } = effect

        this.ctx.shadowBlur = radius
        this.ctx.shadowColor = `rgba(${color.r},${color.g},${color.b},${color.a})`
    }
}

export class CircleDrawer extends ShapeDrawer<Circle> {
    protected drawInternal(shape: Circle, instructions: DrawParameters): void {
        const { zoom, origin, position, effect, color } = instructions
        const oPosition = subtract(position, origin)

        this.ctx.beginPath()
        this.ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
        this.ctx.lineWidth = 2
        this.addEffect(effect)

        const [x, y] = scale(oPosition, zoom)
        this.ctx.arc(x, y, shape.radius * zoom, 0, Math.PI * 2)
        this.ctx.closePath()
        this.ctx.fill()
    }
}

export class RectangleDrawer extends ShapeDrawer<Rectangle> {
    protected drawInternal(shape: Rectangle, instructions: DrawParameters): void {
        const { origin, zoom, position, effect, color } = instructions
        const oPosition = subtract(position, origin)

        this.ctx.beginPath()
        this.addEffect(effect)

        const [ x, y ] = scale(oPosition, zoom)
        const [ w, h ] = scale(shape.dimensions, zoom)

        if (shape.fill) {
            this.ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
            this.ctx.fillRect(x, y, w, h)
        } else {
            this.ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
            this.ctx.strokeRect(x, y, w, h)
        }
        this.ctx.stroke()
    }
}

export class PolygonDrawer extends ShapeDrawer<Polygon> {
    protected drawInternal(shape: Polygon, instructions: DrawParameters): void {
        const { origin, zoom, effect, color } = instructions
        const oPoints = shape.points.map(p => subtract(p, origin))
        const zoomedPoints = oPoints.map(p => scale(p, zoom))

        this.ctx.beginPath()
        this.ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
        this.addEffect(effect)

        const [ firstPoint, ...restPoints ] = zoomedPoints

        this.ctx.moveTo(firstPoint[0], firstPoint[1])
        restPoints.forEach(([x, y]) => this.ctx.lineTo(x, y))
        this.ctx.fill()
    }
}
