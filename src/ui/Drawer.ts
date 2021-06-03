import { ShapeType, Shape } from '../components/Render'
import { Star } from '../LevelManager'
import { DebugInfo } from '../EntityManager'
import { CircleDrawer, DotDrawer, DrawParameters, RectangleDrawer, TriangleDrawer } from './ShapeDrawer'

export class Drawer {
    constructor(readonly ctx: CanvasRenderingContext2D) {}

    private readonly dotDrawer: DotDrawer = new DotDrawer(this.ctx)
    private readonly circleDrawer: CircleDrawer = new CircleDrawer(this.ctx)
    private readonly triangleDrawer: TriangleDrawer = new TriangleDrawer(this.ctx)
    private readonly rectangleDrawer: RectangleDrawer = new RectangleDrawer(this.ctx)

    clear() {
        this.ctx.fillStyle = 'black'
        const { width, height } = this.ctx.canvas
        this.ctx.fillRect(0, 0, width, height)
    }

    drawStars(stars: ReadonlyArray<Star>) {
        this.ctx.save()
        stars.forEach(star => {
            const { intensity, position } = star
            const rgb = `rgb(${intensity},${intensity},${intensity})`
            this.ctx.fillStyle = rgb
            this.ctx.fillRect(position[0], position[1], 1, 1)
        })
        this.ctx.restore()
    }

    drawDebugInfo(debugInfo: DebugInfo) {
        const { playerPosition, entityCount, componentCount } = debugInfo
        const [ playerX, playerY ] = playerPosition

        this.ctx.save()
        this.ctx.font = '12px Arial'
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(`Position: ${playerX.toFixed(0)}, ${playerY.toFixed(0)}`, 10, 20)
        this.ctx.fillText(`Entities: ${entityCount}`, 10, 34)
        this.ctx.fillText(`Components: ${componentCount}`, 10, 48)
        this.ctx.restore()
    }

    drawShape(shape: Shape, params: DrawParameters) {
        switch (shape.type) {
            case ShapeType.DOT:
                this.dotDrawer.draw(shape, params)
                break
            case ShapeType.CIRCLE:
                this.circleDrawer.draw(shape, params)
                break
            case ShapeType.TRIANGLE:
                this.triangleDrawer.draw(shape, params)
                break
            case ShapeType.RECTANGLE:
                this.rectangleDrawer.draw(shape, params)
                break
        }
    }
}

