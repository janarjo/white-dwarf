import { Dimensions, Position, Vector, Triangle as MathTriangle } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export enum ShapeType {
    DOT, CIRCLE, TRIANGLE, RECTANGLE, POLYGON
}

export interface Dot {
    type: ShapeType.DOT
}

export interface Circle {
    type: ShapeType.CIRCLE
    radius: number
}

export interface Rectangle {
    type: ShapeType.RECTANGLE
    dimensions: Dimensions
    fill: boolean
}

export interface Polygon {
    type: ShapeType.POLYGON
    points: Position[]
    triangles: MathTriangle[]
}

export type Shape = Dot | Circle | Rectangle | Polygon

export interface TransformState extends ComponentState {
    position: Position
    direction: Vector
    shape?: Shape
    currShape?: Shape
}

export class Transform extends Component {
    constructor(public state: TransformState) {
        super(ComponentCode.TRANSFORM, 'Core', state)
    }
}
