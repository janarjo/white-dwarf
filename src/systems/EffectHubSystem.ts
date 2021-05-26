import { Effect, EffectHub, EffectType, TriggerType } from '../components/EffectHub'
import { EntityManager } from '../EntityManager'
import { System } from './System'

export class EffectHubSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }

    update() {
        this.entities.withComponents(EffectHub).forEach((parentId) => {
            const hub = this.entities.getComponent(parentId, EffectHub)
            const { effects } = hub.state
            if (!effects) return
            
            const now = performance.now()
            const ongoingEffects = effects.filter(effect => now - effect.startedMs <= effect.durationMs)
            const endingEffects = effects.filter(effect => now - effect.startedMs > effect.durationMs)

            const hasTriggeredDeath = this.hasTriggeredEffect(EffectType.DEATH, ongoingEffects, endingEffects)
            if (hasTriggeredDeath) this.entities.remove(parentId)
            
            hub.state.effects = ongoingEffects
        })
    }

    private hasTriggeredEffect(type: EffectType, ongoingEffects: Effect[], endingEffects: Effect[]) {
        const hasTriggeredBegin = ongoingEffects
            .filter(effect => effect.trigger === TriggerType.BEGIN)
            .some(effect => effect.type === type) 
        const hasTriggeredEnd = endingEffects
            .filter(effect => effect.trigger === TriggerType.END)
            .some(effect => effect.type === type)
        
        return hasTriggeredBegin || hasTriggeredEnd
    }
}
