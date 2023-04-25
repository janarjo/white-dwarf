import { Circle, Triangle, Rectangle, Effect, BaseShape, Polygon } from '../components/Render'
import { Position, rotatePoints, Direction } from '../Math'
import { Dot } from '../components/Render'

export interface DrawParameters {
    position: Position
    direction?: Direction
    effect?: Effect
}

export abstract class ShapeDrawer<T extends BaseShape> {
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
        const { position, effect } = instructions

        this.ctx.beginPath()
        this.ctx.fillStyle = shape.color
        this.addEffect(effect)

        const [x, y] = position
        this.ctx.fillRect(x, y, 2, 2)
        this.ctx.stroke()
    }
}

export class CircleDrawer extends ShapeDrawer<Circle> {
    protected drawInternal(shape: Circle, instructions: DrawParameters): void {
        const { position, effect } = instructions

        this.ctx.beginPath()
        this.ctx.fillStyle = shape.color
        this.ctx.lineWidth = 2
        this.addEffect(effect)

        const [x, y] = position
        this.ctx.arc(x, y, shape.radius, 0, 2 * Math.PI, true)
        this.ctx.closePath()
        this.ctx.fill()
    }
}

export class TriangleDrawer extends ShapeDrawer<Triangle> {
    protected drawInternal(shape: Triangle, instructions: DrawParameters): void {
        const { position, direction, effect } = instructions

        this.ctx.beginPath()
        this.ctx.fillStyle = shape.color
        this.addEffect(effect)
    
        const [ centerX, centerY ] = position
        const halfHeight = (shape.height / 2)
        const halfBase = (shape.base / 2)

        const pointA = [centerX + halfHeight, centerY] as const
        const pointB = [centerX - halfHeight, centerY - halfBase] as const
        const pointC = [centerX - halfHeight, centerY + halfBase] as const
    
        const rotatedPoints = rotatePoints([pointA, pointB, pointC], direction ?? [0, 0], position)
    
        const rotatedPointA = rotatedPoints[0]
        const rotatedPointB = rotatedPoints[1]
        const rotatedPointC = rotatedPoints[2]
    
        this.ctx.moveTo(rotatedPointA[0], rotatedPointA[1])
        this.ctx.lineTo(rotatedPointB[0], rotatedPointB[1])
        this.ctx.lineTo(rotatedPointC[0], rotatedPointC[1])
        this.ctx.lineTo(rotatedPointA[0], rotatedPointA[1])
        this.ctx.fill()
    }
}

export class RectangleDrawer extends ShapeDrawer<Rectangle> {
    protected drawInternal(shape: Rectangle, instructions: DrawParameters): void {
        const { position, effect } = instructions

        this.ctx.beginPath()
        this.addEffect(effect)

        const [ x, y ] = position
        const [ w, h ] = shape.dimensions
        if (shape.fill) {
            this.ctx.fillStyle = shape.color
            this.ctx.fillRect(x, y, w, h)
        } else {
            this.ctx.strokeStyle = shape.color
            this.ctx.strokeRect(x, y, w, h)
        }
        this.ctx.stroke()
    }
}

export class PolygonDrawer extends ShapeDrawer<Polygon> {
    protected drawInternal(shape: Polygon, instructions: DrawParameters): void {
        const { position, direction, effect } = instructions

        this.ctx.beginPath()
        this.ctx.fillStyle = shape.color
        this.addEffect(effect)

        const rotatedPoints = rotatePoints(shape.points, direction ?? [0, 0])
       
        const [ oX, oY ] = position
        const translatedPoints = rotatedPoints.map(([x, y]) => [x + oX, y + oY] as const)
        
        const [ firstPoint, ...restPoints ] = translatedPoints

        this.ctx.moveTo(firstPoint[0], firstPoint[1])
        restPoints.forEach(([x, y]) => this.ctx.lineTo(x, y))
        this.ctx.fill()
    }
}
