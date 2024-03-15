import { ms, Time } from './Units'

export class Clock {
    constructor(readonly updatesPerSec: number) {
        this.updatesPerSec = updatesPerSec
        this.tickInteralMs = 1000 / updatesPerSec
    }

    readonly tickInteralMs
    readonly dtmax = 100
    rate = 1
    prevTick = performance.now()
    elapsedSinceLastTick = 0

    tick(callback: (dt: Time) => void) {
        const now = performance.now()
        const dt = Math.min(now - this.prevTick, this.dtmax) * this.rate
        this.prevTick = now
        this.elapsedSinceLastTick += dt

        while (this.elapsedSinceLastTick >= this.tickInteralMs) {
            this.elapsedSinceLastTick -= this.tickInteralMs
            callback(ms(dt))
        }
    }

    getTickIntervalMs(): number {
        return this.tickInteralMs
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

