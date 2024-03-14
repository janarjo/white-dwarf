import { FrameTimeAnalyzer } from '../src/FrameTimeAnalyzer'

describe('FrameTimeAnalyzer', () => {
    jest.useFakeTimers()

    it('should update frame rate info and initially return 0', () => {
        const fta = new FrameTimeAnalyzer()
        const frameTime = 1000 / 60
        
        const frameRateInfo = fta.updateFrameRateInfo(frameTime)
        
        expect(frameRateInfo.fps).toBe(0)
        expect(frameRateInfo.averageFrameTime).toBe(0)
    })

    it('should update frame rate info and after approx. 1 second return frame info', () => {
        const fta = new FrameTimeAnalyzer()
        const frameTime = 1000 / 60

        for (let i = 0; i < 60; i++) {
            fta.updateFrameRateInfo(i * frameTime + frameTime)
            jest.advanceTimersByTime(frameTime)
        }

        // Extra time to update frame rate info
        jest.advanceTimersByTime(10)

        const frameRateInfo = fta.updateFrameRateInfo(60 * frameTime + frameTime)

        expect(frameRateInfo.fps).toBeCloseTo(60, 0)
        expect(frameRateInfo.averageFrameTime).toBeCloseTo(16.66, 0)
    })
})
