import { Clock } from '../src/Clock'
import { ms } from '../src/Units'

describe('Clock', () => {
    jest.useFakeTimers()

    it('should tick with 0 dt initially', () => {
        const clock = new Clock()
        const callback = jest.fn()
        const frameTimestamp = performance.now()

        clock.tick(frameTimestamp, callback)
        expect(callback).toHaveBeenCalledWith(ms(0))
    })

    it('should tick with non-zero dt', () => {
        const clock = new Clock()
        const callback = jest.fn()
        const frameTimestamp = performance.now()

        clock.tick(frameTimestamp, callback)
        clock.tick(frameTimestamp + 50, callback)
        expect(callback).toHaveBeenCalledWith(ms(50))
    })

    it('should tick with zero dt after pause', () => {
        const clock = new Clock()
        const callback = jest.fn()
        const frameTimestamp = performance.now()

        clock.tick(frameTimestamp, callback)
        clock.setRate(0)
        clock.tick(frameTimestamp + 50, callback)
        expect(callback).toHaveBeenCalledWith(ms(0))
    })

    it('should tick with halved dt after rate change', () => {
        const clock = new Clock()
        const callback = jest.fn()
        const frameTimestamp = performance.now()

        clock.tick(frameTimestamp, callback)
        clock.setRate(0.5)
        clock.tick(frameTimestamp + 50, callback)
        expect(callback).toHaveBeenCalledWith(ms(25))
    })

    it('should tick with max dt when real dt is too large', () => {
        const clock = new Clock()
        const callback = jest.fn()
        const frameTimestamp = performance.now()

        clock.tick(frameTimestamp, callback)
        clock.tick(frameTimestamp + 1000, callback)
        expect(callback).toHaveBeenCalledWith(ms(100))
    })
})
