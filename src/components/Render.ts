import { Component, ComponentCode, ComponentState } from './Component'

export interface FadeEffect {
    durationMs: number
    startedMs: number
}

export type Effect = FadeEffect

export interface RenderState extends ComponentState {
    color: string
    effect?: Effect
}

export class Render extends Component {
    constructor(public state: RenderState) {
        super(ComponentCode.RENDER, 'Render', state)
    }
}
