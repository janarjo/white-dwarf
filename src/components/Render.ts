import { Color } from '../ui/Colors'
import { Component, ComponentCode, ComponentState } from './Component'

export enum EffectCode {
    FADE,
    GLOW,
}

export interface Fade {
    code: EffectCode.FADE
    durationMs: number
    startedMs: number
}

export interface Glow {
    code: EffectCode.GLOW
    radius: number
    color: Color
}

export type Effect = Fade | Glow

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
    effect?: Effect
    animation?: Animation
}

export class Render extends Component {
    constructor(public state: RenderState) {
        super(ComponentCode.RENDER, 'Render', state)
    }
}
