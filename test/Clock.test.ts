import { Clock } from '../src/Clock'
import { ms } from '../src/Units'
describe('Clock', () => {
    const updatesPerSec = 60
    const singleTickMs = (1000 / updatesPerSec) + 1

    it('should tick at the correct rate', () => {
        const clock = new Clock(updatesPerSec)
        const callback = jest.fn()
        const now = performance.now()

        clock.tick(now, callback)
        expect(callback).not.toHaveBeenCalled()

        clock.tick(now + singleTickMs, callback)
        expect(callback).toHaveBeenCalled()
        expect(callback).toHaveBeenCalledWith(ms(16.666666666666668))

        clock.tick(now + singleTickMs * 2, callback)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenCalledWith(ms(16.666666666666668))
    })

    it('should tick at the correct rate when paused', () => {
        const clock = new Clock(updatesPerSec)
        const callback = jest.fn()
        const now = performance.now()

        clock.tick(now, callback)
        expect(callback).not.toHaveBeenCalled()

        clock.setRate(0)

        clock.tick(now + singleTickMs, callback)
        expect(callback).not.toHaveBeenCalled()
    })

    it('should tick at correct rate when frame rate is 120fps', () => {
        const clock = new Clock(updatesPerSec)
        const callback = jest.fn()
        const now = performance.now()
        const frameTimeMs = 1000 / 120

        clock.tick(now, callback)
        for (let frameTime = 0; frameTime < singleTickMs; frameTime += frameTimeMs) {
            clock.tick(now + frameTime, callback)
        }

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(ms(16.666666666666668))
    })

    it('should tick at correct rate when when the frame rate is 30fps', () => {
        const clock = new Clock(updatesPerSec)
        const callback = jest.fn()
        const now = performance.now()
        const frameTimeMs = 1000 / 30

        clock.tick(now, callback)
        clock.tick(now + frameTimeMs, callback)

        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenCalledWith(ms(16.666666666666668))
    })

    it('should prevent spiral of death', () => {
        const clock = new Clock(updatesPerSec)
        const callback = jest.fn()
        const now = performance.now()

        clock.tick(now, callback)
        clock.tick(now + singleTickMs * 500, callback)

        expect(callback).toHaveBeenCalledTimes(240)
    })
})
