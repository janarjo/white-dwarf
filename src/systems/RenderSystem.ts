import { Camera } from '../components/Camera'
import { Collision } from '../components/Collision'
import { Health } from '../components/Health'
import { Circle, Render, ShapeType, Triangle, Shape, Rectangle, Effect } from '../components/Render'
import { Transform } from '../components/Transform'
import { Weapon } from '../components/Weapon'
import { EntityManager } from '../EntityManager'
import { Star } from '../LevelManager'
import { add, Position, rotate, rotatePoints, subtract } from '../Math'
import { Dot } from '../components/Render'
import { System } from './System'

export class RenderSystem extends System {
    constructor(
        private readonly entities: EntityManager,
        private readonly ctx: CanvasRenderingContext2D,
        private readonly stars: ReadonlyArray<Star>,
        private readonly isDebug: boolean) {
        super()
    }

    update() {
        const camera = this.entities
            .withComponents(Camera)
            .map(id => this.entities.getComponent(id, Camera))[0]
        if (!camera) throw Error('No camera found!')
        const origin = camera.state.origin
        this.clear()
        this.drawStars()

        this.entities.withComponents(Transform, Render).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const orientation = transform.state.orientation
            const render = this.entities.getComponent(id, Render)
            const { shape, effect } = render.state

            this.drawShape(position, orientation, shape, effect)
        })

        this.entities.withComponents(Transform, Render, Health).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const orientation = transform.state.orientation
            const health = this.entities.getComponent(id, Health)
            if (!health.state.showIndicator) return

            const maxWidth = 32
            const offset = health.state.verticalOffset
            const width = (health.state.health / health.state.maxHealth) * maxWidth

            const shape: Rectangle = { type: ShapeType.RECTANGLE, color: 'white', dimensions: [width, 2], fill: true }
            this.drawShape(add(position, [-(maxWidth / 2), offset]), orientation, shape)
        })

        /* Debug elements */
        if (!this.isDebug) return
        this.drawDebugInfo()

        this.entities.withComponents(Transform, Render, Collision).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const orientation = transform.state.orientation
            const collision = this.entities.getComponent(id, Collision)
            const [offset, dimensions] = collision.state.boundingBox
            const isColliding = collision.state.isColliding

            const shape: Rectangle = { type: ShapeType.RECTANGLE, color: isColliding ? 'red' : 'white', dimensions, fill: false }
            this.drawShape(add(position, offset), orientation, shape)
        })

        this.entities.withComponents(Transform, Render, Weapon).forEach(id => {
            const transform = this.entities.getComponent(id, Transform)
            const position = subtract(transform.state.position, origin)
            const { orientation } = transform.state
            const weapon = this.entities.getComponent(id, Weapon)
            const { offset } = weapon.state
            const firePosition = rotate(position, orientation, add(position, offset))

            this.drawShape(firePosition, orientation, { type: ShapeType.DOT, color: 'red'})
        })
    }

    private drawDebugInfo() {
        const { playerPosition, entityCount, componentCount } = this.entities.getDebugInfo()
        const [ playerX, playerY ] = playerPosition

        this.ctx.save()
        this.ctx.font = '12px Arial'
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(`Position: ${playerX.toFixed(0)}, ${playerY.toFixed(0)}`, 10, 20)
        this.ctx.fillText(`Entities: ${entityCount}`, 10, 34)
        this.ctx.fillText(`Components: ${componentCount}`, 10, 48)
        this.ctx.restore()
    }

    private clear() {
        this.ctx.fillStyle = 'black'
        const { width, height } = this.ctx.canvas
        this.ctx.fillRect(0, 0, width, height)
    }

    private drawStars() {
        this.ctx.save()
        this.stars.forEach(star => {
            const { intensity, position } = star
            const rgb = `rgb(${intensity},${intensity},${intensity})`
            this.ctx.fillStyle = rgb
            this.ctx.fillRect(position[0], position[1], 1, 1)
        })
        this.ctx.restore()
    }

    private drawShape(position: Position, orientation: number, shape: Shape, effect?: Effect) {
        this.ctx.save()
        switch (shape.type) {
            case ShapeType.DOT:
                this.drawDot(position, shape, effect)
                break
            case ShapeType.CIRCLE:
                this.drawCircle(position, shape, effect)
                break
            case ShapeType.TRIANGLE:
                this.drawTriangle(position, orientation, shape, effect)
                break
            case ShapeType.RECTANGLE:
                this.drawRectangle(position, shape, effect)
                break
        }
        this.ctx.restore()
    }
    
    drawDot(position: Position, shape: Dot, effect?: Effect) {
        this.ctx.beginPath()
        this.ctx.fillStyle = shape.color
        this.addEffect(effect)

        const [x, y] = position
        this.ctx.fillRect(x, y, 2, 2)
        this.ctx.stroke()
    }

    drawCircle(position: Position, shape: Circle, effect?: Effect) {
        this.ctx.beginPath()
        this.ctx.fillStyle = shape.color
        this.ctx.lineWidth = 2
        this.addEffect(effect)

        const [x, y] = position
        this.ctx.arc(x, y, shape.radius, 0, 2 * Math.PI, true)
        this.ctx.closePath()
        this.ctx.fill()
    }

    drawTriangle(position: Position, orientation: number, shape: Triangle, effect?: Effect) {
        this.ctx.beginPath()
        this.ctx.fillStyle = shape.color
        this.addEffect(effect)
    
        const [ centerX, centerY ] = position
        const halfHeight = (shape.height / 2)
        const halfBase = (shape.base / 2)
    
        const pointA = [centerX - halfBase, centerY - halfHeight] as const
        const pointB = [centerX, centerY + halfHeight] as const
        const pointC = [centerX + halfBase, centerY - halfHeight] as const
    
        const rotatedPoints = rotatePoints(position, orientation, [pointA, pointB, pointC])
    
        const rotatedPointA = rotatedPoints[0]
        const rotatedPointB = rotatedPoints[1]
        const rotatedPointC = rotatedPoints[2]
    
        this.ctx.moveTo(rotatedPointA[0], rotatedPointA[1])
        this.ctx.lineTo(rotatedPointB[0], rotatedPointB[1])
        this.ctx.lineTo(rotatedPointC[0], rotatedPointC[1])
        this.ctx.lineTo(rotatedPointA[0], rotatedPointA[1])
        this.ctx.fill()
    }

    drawRectangle(position: Position, shape: Rectangle, effect?: Effect) {
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

    addEffect(effect?: Effect) {
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
