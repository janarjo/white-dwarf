import { Time } from '../Units'
import { Component, ComponentCode } from './Component'
import { ControlState } from './Control'

export interface AIState extends ControlState {
    pollingRate: Time
    lastPolled: number
}

export class AI extends Component<AIState> {
    constructor(public state: AIState) {
        super(ComponentCode.AI, 'AI', state, true)
    }
}
