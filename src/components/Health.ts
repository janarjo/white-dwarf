import { SoundCode } from '../SoundManager'
import { EffectCode } from '../assembly/Effects'
import { Component, ComponentCode, ComponentState } from './Component'

export interface HealthState extends ComponentState {
    health: number
    maxHealth: number
    showIndicator: boolean
    verticalOffset: number
    deathEmitRef?: EffectCode
    deathSound?: SoundCode
}

export class Health extends Component<HealthState> {
    constructor(public state: HealthState) {
        super(ComponentCode.HEALTH, 'Health', state)
    }
}
