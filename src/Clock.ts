import { ms, Time } from './Units'

export class Clock {
    constructor(readonly fps: number) {
        this.fps = fps
        this.intervalMs = 1000 / fps
    }

    readonly intervalMs
    prevTick = performance.now()
    rate = 1
    readonly dtmax = 100

    tick(callback: (dt: Time) => void) {
        const now = performance.now()
        const dt = Math.min(now - this.prevTick, this.dtmax) * this.rate

        if (dt >= this.intervalMs) {
            this.prevTick = now - (dt % (this.intervalMs))
            callback(ms(dt))
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
