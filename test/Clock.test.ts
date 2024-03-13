import { Clock } from '../src/Clock'
import { ms } from '../src/Units'

describe('Clock', () => {
    jest.useFakeTimers()

    it('should tick at the correct rate', () => {
        const clock = new Clock(60)
        const callback = jest.fn()
        
        clock.tick(performance.now(), callback)
        expect(callback).not.toHaveBeenCalled()
        
        jest.advanceTimersByTime((1000 / 60) + 1)
        
        clock.tick(performance.now(), callback)
        expect(callback).toHaveBeenCalled()
        
        jest.advanceTimersByTime((1000 / 60) + 1)
        
        clock.tick(performance.now(), callback)
        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should tick at the correct rate when paused', () => {
        const clock = new Clock(60)
        const callback = jest.fn()
        
        clock.tick(performance.now(), callback)
        expect(callback).not.toHaveBeenCalled()
        
        clock.setRate(0)
        
        jest.advanceTimersByTime((1000 / 60) + 1)
        
        clock.tick(performance.now(), callback)
        expect(callback).not.toHaveBeenCalled()
    })

    it('should provide the correct timings', () => {
        const clock = new Clock(60)
        const callback = jest.fn()
        
        const frameTime = performance.now()
        clock.tick(frameTime, callback)
        expect(callback).not.toHaveBeenCalled()
        
        jest.advanceTimersByTime(50)
        
        clock.tick(frameTime + 75, callback)
        expect(callback).toHaveBeenCalledWith({ dt: ms(50.00000000000001), dft: ms(75) })
    })
})
