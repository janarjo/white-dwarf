import { Offset } from '../math/Math'
import { SoundCode } from '../SoundManager'
import { EffectCode } from '../assembly/Effects'
import { Component, ComponentCode, ComponentState } from './Component'

export enum EmissionType {
    REACTIVE,
    PERIODIC,
}

export enum TriggerType {
    ACCELERATION
}

export interface BaseEmission {
    type: EmissionType
    offset: Offset
    size: number
    emitRef: EffectCode
    emitSound?: SoundCode
}

export interface PeriodicEmission extends BaseEmission {
    type: EmissionType.PERIODIC
    rateMs: number
    lastEmittedMs: number
}

export interface ReactiveEmission extends BaseEmission {
    type: EmissionType.REACTIVE
    trigger: TriggerType
    rateMs: number
    decayMs: number
    lastEmittedMs: number
}

export type Emission = ReactiveEmission | PeriodicEmission

export interface EmitterState extends ComponentState {
    emissions: Emission[]
}

export class Emitter extends Component<EmitterState> {
    constructor(public state: EmitterState) {
        super(ComponentCode.EMITTER, 'Emitter', state)
    }
}
