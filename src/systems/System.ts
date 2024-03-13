import { GameDebugInfo } from '../Game'
import { Time } from '../Units'

export interface System {
    update(dt: Time, debug?: GameDebugInfo): void
}
