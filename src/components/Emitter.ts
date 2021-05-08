import { Offset } from '../Math'
import { Component, ComponentCode, ComponentState } from './Component'

export enum TriggerType {
    ACCELERATION
}

export interface EmitterState extends ComponentState {
    trigger: TriggerType
    rateMs: number
    decayMs: number
    lastEmittedMs: number
    offset: Offset
}

export class Emitter extends Component {
    constructor(public state: EmitterState) {
        super(ComponentCode.EMITTER, 'Emitter', state)
    }
}
