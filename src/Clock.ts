import { ms, Time } from './Units'

export class Clock {
    constructor(readonly updatesPerSec: number) {
        this.updatesPerSec = updatesPerSec
        this.intervalMs = 1000 / updatesPerSec
    }

    readonly intervalMs
    prevTick = performance.now()
    rate = 1
    readonly dtmax = 100
    
    lastFrameTime = 0

    tick(frameTime: number, callback: (timings: Timings) => void) {
        const now = performance.now()
        const dt = Math.min(now - this.prevTick, this.dtmax) * this.rate
        
        const dft = frameTime - this.lastFrameTime
        this.lastFrameTime = frameTime

        if (dt >= this.intervalMs) {
            this.prevTick = now - (dt % (this.intervalMs))
            callback({dt: ms(dt), dft: ms(dft)})
        }
    }

    getRate(): number {
        return this.rate
    }

    setRate(rate: number) {
        this.rate = rate
    }

    isPaused(): boolean {
        return this.rate === 0
    }
}

export interface Timings {

    /**
     * The time since the last tick in milliseconds. Fixed rate.
     */
    dt: Time
    
    /**
     * The time since the last frame in milliseconds. Variable rate.
     */
    dft: Time
}
