import { ms, Time } from './Units'

export class Clock {
    constructor(readonly updatesPerSec: number) {
        this.updatesPerSec = updatesPerSec
        this.tickIntervalMs = 1000 / updatesPerSec
    }

    private readonly tickIntervalMs
    private prevTick = performance.now()
    private elapsedSinceLastTickMs = 0
    private rate = 1

    lastFrameTime = 0

    /**
     * @param callback - The function to call on each tick
     * @returns The remaining time since the last processed tick
     **/
    tick(callback: (dt: Time) => void): Time {
        const now = performance.now()
        this.elapsedSinceLastTickMs += (now - this.prevTick) * this.rate
        this.prevTick = now

        while (this.elapsedSinceLastTickMs >= this.tickIntervalMs) {
            this.elapsedSinceLastTickMs -= this.tickIntervalMs
            callback(ms(this.tickIntervalMs))
        }

        return ms(this.elapsedSinceLastTickMs)
    }

    getTickInterval(): Time {
        return ms(this.tickIntervalMs)
    }

    getRate(): number {
        return this.rate
    }

    setRate(rate: number) {
        this.rate = rate
    }
}
