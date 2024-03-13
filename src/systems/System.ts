import { Timings } from '../Clock'
import { FrameRateDebugInfo } from '../FrameTimeAnalyzer'

export interface System {
    update(timings: Timings, debug?: FrameRateDebugInfo): void
}
