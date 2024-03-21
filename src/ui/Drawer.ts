import { Star } from '../LevelManager'
import { EntityDebugInfo } from '../EntityManager'
import { CircleDrawer, DrawParameters, PolygonDrawer, RectangleDrawer } from './ShapeDrawer'
import { Item, ItemCode } from '../Items'
import { Shape, ShapeType } from '../components/Transform'
import { FrameRateDebugInfo } from '../FrameTimeAnalyzer'

export class Drawer {
    constructor(readonly ctx: CanvasRenderingContext2D) {}

    private readonly circleDrawer: CircleDrawer = new CircleDrawer(this.ctx)
    private readonly rectangleDrawer: RectangleDrawer = new RectangleDrawer(this.ctx)
    private readonly polygonDrawer: PolygonDrawer = new PolygonDrawer(this.ctx)

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

    drawInventory(items: Item[]) {
        const { width, height } = this.ctx.canvas

        this.ctx.save()
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        this.ctx.fillRect(0, 0, width, height)
        this.ctx.fillStyle = 'white'
        this.ctx.font = '20px Arial'
        this.ctx.fillText('Inventory', 10, 30)
        items.forEach((item, index) => {
            const itemInfo = `${ItemCode[item.code]} (x${item.amount})`
            this.ctx.fillText(itemInfo, 10, 60 + 30 * index)
        })
        this.ctx.restore()
    }

    drawDebugInfo(gameInfo: FrameRateDebugInfo, entityInfo: EntityDebugInfo) {
        const {
            playerPosition,
            playerVelocity,
            playerAcceleration,
            entityCount,
            componentCount,
            playerInventory,
            playerQuickSlot,
        } = entityInfo
        const [ playerX, playerY ] = playerPosition
        const playerInventoryInfo = playerInventory.map(item => `${ItemCode[item.code]} (x${item.amount})`).join(', ')
        const playerQuickSlotInfo = playerQuickSlot ? `${ItemCode[playerQuickSlot.code]} (x${playerQuickSlot.amount})` : 'None'

        this.ctx.save()
        this.ctx.font = '12px Arial'
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(`Position: ${playerX.toFixed(0)}, ${playerY.toFixed(0)}`, 10, 20)
        this.ctx.fillText(`Velocity (px/s): ${playerVelocity.toFixed(0)}`, 10, 34)
        this.ctx.fillText(`Acceleration (px/s²): ${playerAcceleration.toFixed(0)}`, 10, 48)
        this.ctx.fillText(`Entities: ${entityCount}`, 10, 62)
        this.ctx.fillText(`Components: ${componentCount}`, 10, 76)
        this.ctx.fillText(`QuickSlot: [${playerQuickSlotInfo}]`, 10, 90)
        this.ctx.fillText(`Inventory: [${playerInventoryInfo}]`, 10, 104)
        this.ctx.fillText(`FPS: ${gameInfo.fps.toFixed(2)}`, 10, 118)
        this.ctx.fillText(`Avg. Frame time (ms): ${gameInfo.averageFrameTime.toFixed(2)}`, 10, 132)
        this.ctx.restore()
    }

    drawShape(shape: Shape, params: DrawParameters) {
        switch (shape.type) {
            case ShapeType.CIRCLE:
                this.circleDrawer.draw(shape, params)
                break
            case ShapeType.RECTANGLE:
                this.rectangleDrawer.draw(shape, params)
                break
            case ShapeType.POLYGON:
                this.polygonDrawer.draw(shape, params)
                break
        }
    }
}
