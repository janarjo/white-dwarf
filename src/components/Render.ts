import { Dimensions } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export enum ShapeType {
    DOT, CIRCLE, TRIANGLE, RECTANGLE
}

interface BaseShape {
    color: string
}

export interface Dot extends BaseShape {
    type: ShapeType.DOT
}

export interface Circle extends BaseShape {
    type: ShapeType.CIRCLE
    radius: number
}

export interface Triangle extends BaseShape {
    type: ShapeType.TRIANGLE
    base: number
    height: number
}

export interface Rectangle extends BaseShape {
    type: ShapeType.RECTANGLE
    dimensions: Dimensions
    fill: boolean
}

export type Shape = Dot | Circle | Triangle | Rectangle

export interface FadeEffect {
    durationMs: number
    startedMs: number
}

export type Effect = FadeEffect

export interface RenderState extends ComponentState {
    shape: Shape
    effect?: Effect
}

export class Render extends Component {
    constructor(public state: RenderState) {
        super(ComponentCode.RENDER, 'Render', state)
    }
}
