import { Component, ComponentCode, ComponentState } from './Component'

export interface HealthState extends ComponentState {
    health: number
    maxHealth: number
    showIndicator: boolean
    verticalOffset: number
}

export class Health extends Component {
    constructor(public state: HealthState) {
        super(ComponentCode.HEALTH, 'Health', state)
    }
}
