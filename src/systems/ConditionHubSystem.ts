import { Condition, ConditionHub, ConditionType, TriggerType } from '../components/ConditionHub'
import { EntityManager } from '../EntityManager'
import { System } from './System'

export class ConditionHubSystem implements System {
    constructor(
        private readonly entities: EntityManager) {
    }

    update() {
        this.entities.withComponents(ConditionHub).forEach((parentId) => {
            const hub = this.entities.getComponent(parentId, ConditionHub)
            const { conditions } = hub.state
            if (!conditions) return

            const now = performance.now()
            const ongoingConditions = conditions.filter(condition => now - condition.startedMs <= condition.durationMs)
            const endingConditions = conditions.filter(condition => now - condition.startedMs > condition.durationMs)

            const hasTriggeredDeath = this.hasTriggeredEffect(ConditionType.DYING, ongoingConditions, endingConditions)
            if (hasTriggeredDeath) this.entities.remove(parentId)

            hub.state.conditions = ongoingConditions
        })
    }

    private hasTriggeredEffect(type: ConditionType, ongoingEffects: Condition[], endingEffects: Condition[]) {
        const hasTriggeredBegin = ongoingEffects
            .filter(effect => effect.trigger === TriggerType.BEGIN)
            .some(effect => effect.type === type)
        const hasTriggeredEnd = endingEffects
            .filter(effect => effect.trigger === TriggerType.END)
            .some(effect => effect.type === type)

        return hasTriggeredBegin || hasTriggeredEnd
    }
}
