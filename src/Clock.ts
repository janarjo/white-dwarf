import { ms, Time } from './Units'

export class Clock {
    constructor(readonly updatesPerSec: number) {
        this.updatesPerSec = updatesPerSec
        this.timeStepMs = 1000 / updatesPerSec
    }

    private readonly dftMax = 100
    private readonly timeStepMs
    private accumulatedTimeMs = 0
    private rate = 1

    prevFrameTimestamp = performance.now()

    /**
     * @param callback - The function to call on each tick
     * @returns The alpha value for interpolation (0-1)
     **/
    tick(frameTimestamp: number, callback: (dt: Time) => void) {
        const dft = frameTimestamp - this.prevFrameTimestamp
        this.prevFrameTimestamp = frameTimestamp
        this.accumulatedTimeMs += dft * this.rate

        let numUpdateSteps = 0
        while (this.accumulatedTimeMs >= this.timeStepMs) {
            this.accumulatedTimeMs -= this.timeStepMs
            callback(ms(this.timeStepMs))

            // Prevent spiral of death
            if (++numUpdateSteps >= 240) {
                this.accumulatedTimeMs = 0
                break
            }
        }
    }

    getRate(): number {
        return this.rate
    }

    setRate(rate: number) {
        this.rate = rate
    }
}
