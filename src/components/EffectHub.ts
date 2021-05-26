import { Component, ComponentCode, ComponentState } from './Component'

export enum EffectType {
    DEATH
}

export enum TriggerType {
    BEGIN,
    END
}

export interface Effect {
    type: EffectType
    trigger: TriggerType
    durationMs: number
    startedMs: number
}

export interface DeathEffect extends Effect {
    type: EffectType.DEATH
}

export interface EffectHubState extends ComponentState {
    effects: Effect[]
}

export class EffectHub extends Component {
    constructor(public state: EffectHubState) {
        super(ComponentCode.EFFECT_HUB, 'Effect Hub', state)
    }
}
