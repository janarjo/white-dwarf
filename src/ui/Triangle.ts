import { Position, rotatePoints, Vector } from '../Math'
import { Shape, ShapeType } from './Shape'

export class Triangle extends Shape {
    constructor(
            position: Position,
            protected orientation: number,
            color: string = 'white',
            protected base: number = 30,
            protected height: number = 50) {
        super(ShapeType.TRIANGLE, position, color)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.fillStyle = this.color

        const centerX = this.position[0]
        const centerY = this.position[1]
        const halfHeight = (this.height / 2)
        const halfBase = (this.base / 2)

        const pointA = [centerX - halfBase, centerY - halfHeight] as const
        const pointB = [centerX, centerY + halfHeight] as const
        const pointC = [centerX + halfBase, centerY - halfHeight] as const

        const rotatedPoints = rotatePoints(this.position, this.orientation, [pointA, pointB, pointC])

        const rotatedPointA = rotatedPoints[0]
        const rotatedPointB = rotatedPoints[1]
        const rotatedPointC = rotatedPoints[2]

        ctx.moveTo(rotatedPointA[0], rotatedPointA[1])
        ctx.lineTo(rotatedPointB[0], rotatedPointB[1])
        ctx.lineTo(rotatedPointC[0], rotatedPointC[1])
        ctx.lineTo(rotatedPointA[0], rotatedPointA[1])
        ctx.fill()
    }
}
