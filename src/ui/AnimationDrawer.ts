import { scale, subtract } from '../Math'
import { Explosion } from '../components/Render'
import { DrawParameters } from './ShapeDrawer'
import { Animation } from '../components/Render'

export abstract class AnimationDrawer<T extends Animation> {
    protected ctx: CanvasRenderingContext2D

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    protected abstract drawInternal(shape: T, params: DrawParameters): void

    draw(shape: T, params: DrawParameters) {
        this.ctx.save()
        this.drawInternal(shape, params)
        this.ctx.restore()
    }
}

export class ExplosionDrawer extends AnimationDrawer<Explosion> {

    drawInternal(animation: Explosion, params: DrawParameters) {
        const { zoom, origin, position, color } = params
        const oPosition = subtract(position, origin)
        const { radius, durationMs, startedMs } = animation
        const elapsed = performance.now() - startedMs
        const progress = elapsed / durationMs
        const radiusProgress = Math.min(progress, 1) * radius
        const fadeProgress = Math.max(1 - progress, 0)

        const [x, y] = scale(oPosition, zoom)

        this.ctx.beginPath()
        this.ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${fadeProgress})`
        this.ctx.arc(x, y, radiusProgress * zoom, 0, Math.PI * 2)
        this.ctx.closePath()
        this.ctx.fill()
    }
}
