import { Component, ComponentCode, ComponentState } from './Component'

export enum ConditionType {
    DYING
}

export enum TriggerType {
    BEGIN,
    END
}

export interface Condition {
    type: ConditionType
    trigger: TriggerType
    durationMs: number
    startedMs: number
}

export interface Dying extends Condition {
    type: ConditionType.DYING
}

export interface ConditionHubState extends ComponentState {
    conditions: Condition[]
}

export class ConditionHub extends Component<ConditionHubState> {
    constructor(public state: ConditionHubState) {
        super(ComponentCode.CONDITION_HUB, 'Condition Hub', state)
    }
}
