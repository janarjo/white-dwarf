import { Offset } from '../Math'
import { SoundCode } from '../SoundManager'
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
    size: number
    emitSound?: SoundCode
}

export class Emitter extends Component {
    constructor(public state: EmitterState) {
        super(ComponentCode.EMITTER, 'Emitter', state)
    }
}
