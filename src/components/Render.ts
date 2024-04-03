import { Color } from '../ui/Colors'
import { Component, ComponentCode, ComponentState } from './Component'

export enum DrawEffectCode {
    FADE,
    GLOW,
}

export interface Fade {
    code: DrawEffectCode.FADE
    durationMs: number
    startedMs: number
}

export interface Glow {
    code: DrawEffectCode.GLOW
    radius: number
    color: Color
}

export type DrawEffect = Fade | Glow

export enum AnimationCode {
    EXPLOSION,
}

export interface Explosion {
    code: AnimationCode.EXPLOSION
    radius: number
    durationMs: number
    startedMs: number
}

export type Animation = Explosion

export interface RenderState extends ComponentState {
    color: Color
    drawEffect?: DrawEffect
    animation?: Animation
}

export class Render extends Component {
    constructor(public state: RenderState) {
        super(ComponentCode.RENDER, 'Render', state)
    }
}
