import { Timings } from '../Clock'

export interface System {
    update(timings: Timings): void
}
