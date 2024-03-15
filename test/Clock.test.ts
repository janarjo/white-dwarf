import { Clock } from '../src/Clock'
import { ms } from '../src/Units'

describe('Clock', () => {
    jest.useFakeTimers()

    it('should tick at the correct rate', () => {
        const clock = new Clock(60)
        const callback = jest.fn()

        clock.tick(callback)
        expect(callback).not.toHaveBeenCalled()

        jest.advanceTimersByTime((1000 / 60) + 1)

        clock.tick(callback)
        expect(callback).toHaveBeenCalled()

        jest.advanceTimersByTime((1000 / 60) + 1)

        clock.tick(callback)
        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should tick at the correct rate when paused', () => {
        const clock = new Clock(60)
        const callback = jest.fn()

        clock.tick( callback)
        expect(callback).not.toHaveBeenCalled()

        clock.setRate(0)

        jest.advanceTimersByTime((1000 / 60) + 1)

        clock.tick(callback)
        expect(callback).not.toHaveBeenCalled()
    })

    it('should provide the correct timings when paused', () => {
        const clock = new Clock(60)
        const callback = jest.fn()

        clock.tick(callback)
        expect(callback).not.toHaveBeenCalled()

        clock.setRate(0)

        jest.advanceTimersByTime(100)

        clock.tick(callback)
        expect(callback).not.toHaveBeenCalled()
    })

    it ('should provide correct timings when the frame rate is 120fps', () => {
        const clock = new Clock(60)
        const tickIntervalMs = clock.getTickIntervalMs()
        const callback = jest.fn()

        const frameTimeMs = 1000 / 120

        clock.tick(callback)
        for (let frameTime = 0; frameTime < (tickIntervalMs + 1); frameTime += frameTimeMs) {
            jest.advanceTimersByTime(frameTime)
            clock.tick(callback)
        }

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback.mock.calls[0][0].toMs()).toBeCloseTo(16.6666, 1)
    })

    it('should provide correct timings when the frame rate is 30', () => {
        const clock = new Clock(60)
        const callback = jest.fn()

        clock.tick(callback)

        jest.advanceTimersByTime(1000 / 30)

        clock.tick(callback)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback.mock.calls[0][0].toMs()).toBeCloseTo(33.3333, 1)
    })

    it('should provide the dtMax when the frame rate is extremely low', () => {
        const clock = new Clock(60)
        const callback = jest.fn()

        clock.tick(callback)

        jest.advanceTimersByTime(1000)

        clock.tick(callback)
        expect(callback).toHaveBeenCalledWith(ms(100))
    })
})
