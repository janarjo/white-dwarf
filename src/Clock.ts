import { ms, Time } from './Units'

export class Clock {
    readonly dtmax = 100
    rate = 1

    prevFrameTime = 0

    tick(frameTime: number, callback: (dt: Time) => void) {
        const dft = Math.min(frameTime - this.prevFrameTime, this.dtmax) * this.rate
        this.prevFrameTime = frameTime

        callback(ms(dft))
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
