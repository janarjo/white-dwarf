import { Clock } from '../src/Clock'

describe('Clock', () => {
    jest.useFakeTimers()

    it('should tick at the correct rate', () => {
        const clock = new Clock(60)
        const callback = jest.fn()
        
        clock.tick(callback)
        expect(callback).not.toBeCalled()
        
        jest.advanceTimersByTime((1000 / 60) + 1)
        
        clock.tick(callback)
        expect(callback).toBeCalled()
        
        jest.advanceTimersByTime((1000 / 60) + 1)
        
        clock.tick(callback)
        expect(callback).toBeCalledTimes(2)
    })

    it('should tick at the correct rate when paused', () => {
        const clock = new Clock(60)
        const callback = jest.fn()
        
        clock.tick(callback)
        expect(callback).not.toBeCalled()
        
        clock.setRate(0)
        
        jest.advanceTimersByTime((1000 / 60) + 1)
        
        clock.tick(callback)
        expect(callback).not.toBeCalled()
    })
})
